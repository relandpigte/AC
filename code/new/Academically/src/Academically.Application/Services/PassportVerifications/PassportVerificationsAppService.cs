using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Authorization;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.PassportVerifications.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Academically.Services.PassportVerifications
{
    [AbpAuthorize(PermissionNames.Pages_Widgets_Verifications)]
    public class PassportVerificationsAppService : AcademicallyAppServiceBase, IPassportVerificationsAppService
    {
        private readonly IRepository<PassportVerification, Guid> _passportVerificationsRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public PassportVerificationsAppService(
            IRepository<PassportVerification, Guid> passportVerificationsRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerService
            )
        {
            _passportVerificationsRepository = passportVerificationsRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
        }

        public async Task Create([FromForm] CreatePassportVerificationDto input)
        {
            var passportVerification = ObjectMapper.Map<PassportVerification>(input);
            passportVerification.Status = PassportVerificationStatus.PendingVerification;

            string folder = await GetPassportsFolder();
            string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(input.PassportPhoto.FileName)}";
            using (var stream = input.PassportPhoto.OpenReadStream())
            {
                var fileBytes = stream.GetAllBytes();
                await _fileManagerService.UploadAsync(fileName, fileBytes, folder, true);
            }
            var document = new Document()
            {
                Name = fileName,
                OriginalFileName = input.PassportPhoto.FileName,
                FileType = input.PassportPhoto.ContentType,
                DocumentType = DocumentType.Qualification,
                Size = input.PassportPhoto.Length,
            };
            passportVerification.Document = document;

            await _passportVerificationsRepository.InsertAsync(passportVerification);
        }

        private async Task<string> GetPassportsFolder()
        {
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Passports);
            folder = $"{AbpSession.UserId.Value}/{folder}";
            return folder;
        }
    }
}
