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
using Academically.Services.Profiles.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Profiles
{
    [AbpAuthorize(PermissionNames.Pages_Profile)]
    public class ProfilesAppService : AcademicallyAppServiceBase, IProfilesAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<User, long> _usersRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public ProfilesAppService(
            UserManager userManager,
            IRepository<User, long> usersRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerService
            )
        {
            _userManager = userManager;
            _usersRepository = usersRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
        }

        public async Task<UserDto> Get(long id)
        {
            var user = await _usersRepository.GetAllIncluding(e => e.Roles)
                .FirstOrDefaultAsync(e => e.Id == id);
            var output = ObjectMapper.Map<UserDto>(user);
            output.RoleNames = await _userManager.GetRolesAsync(user);

            if (!user.CoverPhotoFileName.IsNullOrWhiteSpace())
            {
                output.CoverPhotoUrl = _fileManagerService.GetFileUrl(user.CoverPhotoFileName, user.Id, AppSettingNames.Aws_S3_Folders_CoverPhotos);
            }

            return output;
        }

        public async Task<VerificationStatusDto> GetVerificationStatus(long id)
        {
            var user = await _usersRepository.GetAsync(id);
            var verificationStatus = new VerificationStatusDto()
            {
                IsEmailConfirmed = user.IsEmailConfirmed,
                IsPhoneNumberConfirmed = user.IsPhoneNumberConfirmed,
            };
            return verificationStatus;
        }

        public async Task UpdateWebsiteUrl(string websiteUrl)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.WebsiteUrl = websiteUrl;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task UpdateAbout(string about)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.About = about;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task<string> UpdateCoverPhoto([FromForm] UpdateCoverPhotoInput input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
            folder = $"{userId}/{folder}";
            string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(input.CoverPhoto.FileName)}";
            string oldFileName = "";

            using (var stream = input.CoverPhoto.OpenReadStream())
            {
                var fileBytes = stream.GetAllBytes();
                await _fileManagerService.UploadAsync(fileName, fileBytes, folder);
                oldFileName = user.CoverPhotoFileName;
                user.CoverPhotoFileName = fileName;
            }

            await _usersRepository.UpdateAsync(user);

            if (!oldFileName.IsNullOrWhiteSpace())
            {
                await _fileManagerService.DeleteAsync(folder, oldFileName);
            }

            return _fileManagerService.GetFileUrl(user.CoverPhotoFileName, user.Id, AppSettingNames.Aws_S3_Folders_CoverPhotos);
        }

        public async Task DeleteCoverPhoto()
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
            folder = $"{user.Id}/{folder}";
            await _fileManagerService.DeleteAsync(folder, user.CoverPhotoFileName);
            user.CoverPhotoFileName = "";
            await _usersRepository.UpdateAsync(user);
        }
    }
}
