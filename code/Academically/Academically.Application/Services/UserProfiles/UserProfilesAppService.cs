using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Authorization;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.UserProfiles.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Academically.Services.UserProfiles
{
    [AbpAuthorize(PermissionNames.Pages_Profile)]
    public class UserProfilesAppService : AcademicallyAppServiceBase, IUserProfilesAppService
    {
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public UserProfilesAppService(
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<User, long> usersRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerService
            )
        {
            _userProfilesRepository = userProfilesRepository;
            _usersRepository = usersRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Details)]
        public async Task<GetProfileDetailDto> GetDetail()
        {
            var userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);

            var output = ObjectMapper.Map<GetProfileDetailDto>(userProfile);
            if (output == null)
            {
                output = new GetProfileDetailDto();
            }
            output.FirstName = user.Name;
            output.LastName = user.Surname;
            output.ProfilePictureUrl = _fileManagerService.GetFileUrl(userProfile?.ProfilePictureFileName, userId, AppSettingNames.Aws_S3_Folders_ProfilePictures);

            return output;
        }

        public async Task SaveDetail([FromForm] SaveProfileDetailDto input)
        {
            var userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            user.Name = input.FirstName;
            user.Surname = input.LastName;

            var userProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == userId);
            if (userProfile == null)
            {
                userProfile = new UserProfile();
            }

            string oldFileName = "";
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_ProfilePictures);
            folder = $"{userId}/{folder}";
            string thumbnailsFolder = $"{folder}/thumbs";

            ObjectMapper.Map(input, userProfile);
            userProfile.UserId = user.Id;

            if (input.ProfilePicture != null)
            {
                string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(input.ProfilePicture.FileName)}";

                using (var stream = input.ProfilePicture.OpenReadStream())
                {
                    var fileBytes = stream.GetAllBytes();
                    await _fileManagerService.UploadAsync(fileName, fileBytes, folder);
                    oldFileName = userProfile.ProfilePictureFileName;
                    userProfile.ProfilePictureFileName = fileName;

                    var thumbsFileBytes = MakeThumbnail(fileBytes, 100, 100);
                    await _fileManagerService.UploadAsync(fileName, thumbsFileBytes, thumbnailsFolder);
                }
            }

            await _userProfilesRepository.InsertOrUpdateAsync(userProfile);

            if (!oldFileName.IsNullOrWhiteSpace())
            {
                await _fileManagerService.DeleteAsync(folder, oldFileName);
                await _fileManagerService.DeleteAsync(thumbnailsFolder, oldFileName);
            }
        }

        public byte[] MakeThumbnail(byte[] myImage, int thumbWidth, int thumbHeight)
        {
            using (MemoryStream ms = new MemoryStream())
            using (Image thumbnail = Image.FromStream(new MemoryStream(myImage)).GetThumbnailImage(thumbWidth, thumbHeight, null, new IntPtr()))
            {
                thumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                return ms.ToArray();
            }
        }
    }
}
