using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Authorization;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.UserQualifications.Dto;
using Microsoft.AspNetCore.Mvc;
using SourceCloud.Core.Services;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Academically.Services.UserQualifications
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications)]
    public class UserQualificationsAppService : AcademicallyAppServiceBase, IUserQualificationsAppService
    {
        private readonly IRepository<UserQualification, Guid> _userQualificationsRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public UserQualificationsAppService(
            IRepository<UserQualification, Guid> userQualificationsRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerService
            )
        {
            _userQualificationsRepository = userQualificationsRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
        }

        public Task<UserQualificationDto> GetAll()
        {
            throw new NotImplementedException();
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications_Create)]
        public async Task Create([FromForm]CreateUserQualificationDto input)
        {
            var userQualification = ObjectMapper.Map<UserQualification>(input);
            var userId = AbpSession.UserId.Value;

            foreach (var documentToUpload in input.DocumentsToUpload)
            {
                string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Qualifications);
                folder = $"{userId}/{folder}";
                string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(documentToUpload.FileName)}";
                using (var stream = documentToUpload.OpenReadStream())
                {
                    var fileBytes = stream.GetAllBytes();
                    await _fileManagerService.UploadAsync(fileName, documentToUpload.ContentType, fileBytes, folder, true);
                }
                userQualification.UserQualificationDocuments.Add(new UserQualificationDocument()
                {
                    Document = new Document()
                    {
                        Name = fileName,
                        OriginalFileName = documentToUpload.FileName,
                        FileType = documentToUpload.ContentType,
                        DocumentType = DocumentType.Qualification,
                    },
                    IsReviewed = false,
                });
            }

            await _userQualificationsRepository.InsertAsync(userQualification);
        }
    }
}
