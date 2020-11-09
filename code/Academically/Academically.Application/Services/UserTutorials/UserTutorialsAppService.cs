using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.UserTutorials.Dto;
using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserTutorials
{
    public class UserTutorialsAppService : AcademicallyAppServiceBase, IUserTutorialsAppService
    {
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<UserTutorialDisciplineTaxonomy, Guid> _userTutorialsDisciplineTaxonomiesRepository;
        private readonly IRepository<UserProfile, Guid> _userProfileRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;
        public UserTutorialsAppService
        (
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<UserTutorialDisciplineTaxonomy, Guid> userTutorialsDisciplineTaxonomiesRepository,
            IRepository<UserProfile, Guid> userProfileRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerservice
        )
        {
            _userTutorialsRepository = userTutorialsRepository;
            _userTutorialsDisciplineTaxonomiesRepository = userTutorialsDisciplineTaxonomiesRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerservice;
            _userProfileRepository = userProfileRepository;
        }


        public async Task CreateAsync([FromForm] SaveUserTutorialDto inputs)
        {
            var userId = AbpSession.UserId.Value;
            var userTutorial = new UserTutorial();
            var userprofile =  _userProfileRepository.GetAll()
                .Where(e => e.UserId == userId)
                .FirstOrDefault();
            ObjectMapper.Map(inputs, userTutorial);

            userTutorial.UserId = userId;
            userTutorial.CreatedDate = DateTime.UtcNow;
            userTutorial.UserProfileId = userprofile.Id;
            userTutorial.ServiceTypeId = Guid.Parse(await _settingManager.GetSettingValueAsync(AppSettingNames.Services_Tutorial));
            var folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_UserTutorialPictures);
            folder = $"{userId}/{folder}";
            var thumbnailsFolder = $"{folder}/thumbs";

            if (inputs.Picture != null)
            {
                var fileName = $"{Clock.Now.Ticks}{Path.GetExtension(inputs.Picture.FileName)}";

                using (var stream = inputs.Picture.OpenReadStream())
                {
                    var fileBytes = stream.GetAllBytes();
                    await _fileManagerService.UploadAsync(fileName, fileBytes, folder);
                    userTutorial.PictureFileName = fileName;

                    var thumbsFileBytes = MakeThumbnail(fileBytes, 100, 100);
                    await _fileManagerService.UploadAsync(fileName, thumbsFileBytes, thumbnailsFolder);
                }
            }

            await _userTutorialsRepository.InsertAsync(userTutorial);

            if (userTutorial.Id != null && inputs.DisciplineTaxonomyIds.Count() > 0)
            {
                foreach (var disciplineTaxonomyId in inputs.DisciplineTaxonomyIds)
                {
                    var userTutorialDisciplineTaxonomy = new UserTutorialDisciplineTaxonomy()
                    {
                        TutorialId = userTutorial.Id,
                        DisciplineTaxonomyId = disciplineTaxonomyId
                    };
                    await _userTutorialsDisciplineTaxonomiesRepository.InsertAsync(userTutorialDisciplineTaxonomy);
                }
            }
        }

        public async Task<IEnumerable<UserTutorialDto>> GetAsync()
        {
            var userTutorials = await _userTutorialsRepository.GetAll()
                .Select(e => ObjectMapper.Map<UserTutorialDto>(e))
                .ToListAsync();

            return userTutorials;
        }

        private byte[] MakeThumbnail(byte[] imageBytes, int thumbWidth, int thumbHeight)
        {
            using (MemoryStream ms = new MemoryStream())
            using (Image image = Image.Load(imageBytes))
            {
                var resizeOptions = new ResizeOptions
                {
                    Size = new SixLabors.ImageSharp.Size { Width = thumbWidth, Height = thumbHeight },
                    Mode = ResizeMode.Stretch
                };
                image.Mutate(x => x.Resize(resizeOptions));
                image.Save(ms, new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder());
                ms.Position = 0;
                return ms.ToArray();
            }
        }
    }
}
