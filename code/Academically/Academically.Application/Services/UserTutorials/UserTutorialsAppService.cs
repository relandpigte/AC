using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.UserTutorials.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

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


        public async Task<Guid> CreateAsync([FromForm] SaveUserTutorialDto inputs)
        {
            var userId = AbpSession.UserId.Value;
            var userTutorial = new UserTutorial();
            var userProfile =  _userProfileRepository.GetAll()
                .Where(e => e.UserId == userId)
                .FirstOrDefault();
            ObjectMapper.Map(inputs, userTutorial);

            userTutorial.StudentId = userProfile.Id;
            userTutorial.CreatedDate = DateTime.UtcNow;
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

            var id = await _userTutorialsRepository.InsertAndGetIdAsync(userTutorial);

            if (userTutorial.Id != null && inputs.DisciplineTaxonomyIds.Count() > 0)
            {
                var ids = inputs.DisciplineTaxonomyIds.SelectMany(x => x.Split(","));
                foreach (var disciplineTaxonomyId in ids)
                {
                    var userTutorialDisciplineTaxonomy = new UserTutorialDisciplineTaxonomy()
                    {
                        TutorialId = userTutorial.Id,
                        DisciplineTaxonomyId = Guid.Parse(disciplineTaxonomyId)
                    };
                    await _userTutorialsDisciplineTaxonomiesRepository.InsertAsync(userTutorialDisciplineTaxonomy);
                }
            }

            return id;
        }

        public async Task<IEnumerable<UserTutorialDto>> GetRecent()
        {
            var userTutorials = await _userTutorialsRepository.GetAll()
                .Where(e => e.Student.UserId == AbpSession.UserId.Value)
                .OrderByDescending(e => e.CreatedDate)
                .Take(5)
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
