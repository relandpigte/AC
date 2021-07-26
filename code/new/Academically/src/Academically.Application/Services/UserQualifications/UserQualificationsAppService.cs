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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SourceCloud.Core.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.UserQualifications
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications)]
    public class UserQualificationsAppService : AcademicallyAppServiceBase, IUserQualificationsAppService
    {
        private readonly IRepository<UserQualification, Guid> _userQualificationsRepository;
        private readonly IRepository<UserQualificationDocument, Guid> _userQualificationDocumentsRepository;
        private readonly IRepository<Document, Guid> _documentsRepository;
        private readonly ISettingManager _settingManager;
        private readonly IFileManagerService _fileManagerService;

        public UserQualificationsAppService(
            IRepository<UserQualification, Guid> userQualificationsRepository,
            IRepository<UserQualificationDocument, Guid> userQualificationDocumentsRepository,
            IRepository<Document, Guid> documentsRepository,
            ISettingManager settingManager,
            IFileManagerService fileManagerService
            )
        {
            _userQualificationsRepository = userQualificationsRepository;
            _userQualificationDocumentsRepository = userQualificationDocumentsRepository;
            _documentsRepository = documentsRepository;
            _settingManager = settingManager;
            _fileManagerService = fileManagerService;
        }

        public async Task<IEnumerable<UserQualificationDto>> GetAll(long userId)
        {
            var userQualifications = await _userQualificationsRepository.GetAll()
                .Where(e => e.CreatorUserId == userId)
                .Include(e => e.UserQualificationDocuments)
                    .ThenInclude(e => e.Document)
                .Select(e => ObjectMapper.Map<UserQualificationDto>(e))
                .ToListAsync();
            return userQualifications;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications_Create)]
        public async Task Create([FromForm] CreateEditUserQualificationDto input)
        {
            var userQualification = ObjectMapper.Map<UserQualification>(input);
            var userQualificationDocuments = await UploadDocuments(input.DocumentsToUpload);
            userQualificationDocuments.ForEach(e => userQualification.UserQualificationDocuments.Add(e));

            await _userQualificationsRepository.InsertAsync(userQualification);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications_Update)]
        public async Task Update([FromQuery] Guid id, [FromForm] CreateEditUserQualificationDto input)
        {
            var userQualification = await _userQualificationsRepository.GetAsync(id);
            ObjectMapper.Map(input, userQualification);

            var userQualificationDocuments = await UploadDocuments(input.DocumentsToUpload);
            userQualificationDocuments.ForEach(e => userQualification.UserQualificationDocuments.Add(e));

            await _userQualificationsRepository.UpdateAsync(userQualification);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications_Delete)]
        public async Task Delete(Guid id)
        {
            var userQualification = await _userQualificationsRepository.GetAll()
                .Include(e => e.UserQualificationDocuments)
                    .ThenInclude(e => e.Document)
                .FirstOrDefaultAsync(e => e.Id == id);

            string folder = await GetQualificationsFolder();
            foreach (var userQualificationDocument in userQualification.UserQualificationDocuments)
            {
                await _fileManagerService.DeleteAsync(folder, userQualificationDocument.Document.Name, true);
                await _documentsRepository.DeleteAsync(userQualificationDocument.DocumentId);
                await _userQualificationDocumentsRepository.DeleteAsync(userQualificationDocument.Id);
            }

            await _userQualificationsRepository.DeleteAsync(userQualification);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Qualifications_Delete)]
        public async Task DeleteDocument(Guid userQualificationDocumentId)
        {
            var userQualificationDocument = await _userQualificationDocumentsRepository.GetAll()
                .Include(e => e.Document)
                .FirstOrDefaultAsync(e => e.Id == userQualificationDocumentId);

            string folder = await GetQualificationsFolder();
            await _fileManagerService.DeleteAsync(folder, userQualificationDocument.Document.Name, true);

            await _documentsRepository.DeleteAsync(userQualificationDocument.DocumentId);
            await _userQualificationDocumentsRepository.DeleteAsync(userQualificationDocument.Id);
        }

        private async Task<string> GetQualificationsFolder()
        {
            string folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Qualifications);
            folder = $"{AbpSession.UserId.Value}/{folder}";
            return folder;
        }

        private async Task<List<UserQualificationDocument>> UploadDocuments(IEnumerable<IFormFile> documents)
        {
            var userQualificationDocuments = new List<UserQualificationDocument>();
            if (documents != null)
            {
                foreach (var documentToUpload in documents)
                {
                    string folder = await GetQualificationsFolder();
                    string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(documentToUpload.FileName)}";
                    using (var stream = documentToUpload.OpenReadStream())
                    {
                        var fileBytes = stream.GetAllBytes();
                        await _fileManagerService.UploadAsync(fileName, documentToUpload.ContentType, fileBytes, folder, true);
                    }
                    userQualificationDocuments.Add(new UserQualificationDocument()
                    {
                        Document = new Document()
                        {
                            Name = fileName,
                            OriginalFileName = documentToUpload.FileName,
                            FileType = documentToUpload.ContentType,
                            DocumentType = DocumentType.Qualification,
                            Size = documentToUpload.Length,
                        },
                        IsReviewed = false,
                    });
                }
            }
            return userQualificationDocuments;
        }
    }
}
