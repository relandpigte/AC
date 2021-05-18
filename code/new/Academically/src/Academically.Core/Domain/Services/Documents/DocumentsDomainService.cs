using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;
using SourceCloud.Core.Services;

namespace Academically.Domain.Services.Documents
{
    public class DocumentsDomainService : AcademicallyDomainServiceBase, IDocumentsDomainService
    {
        private readonly IRepository<Document, Guid> _documentsRepository;
        private readonly IFileManagerService _fileManagerService;

        public DocumentsDomainService(
            IRepository<Document, Guid> documentsRepository,
            IFileManagerService fileManagerService
            )
        {
            _documentsRepository = documentsRepository;
            _fileManagerService = fileManagerService;
        }

        public string GetBaseDirectory()
        {
            return _fileManagerService.GetDirectoryUrl();
        }

        public async Task<string> GetFileUrlAsync(Document document)
        {
            if(document == null)
            {
                return string.Empty;
            }

            var (folder, isSecured) = await GetFolderAsync(document.CreatorUserId.Value, document.DocumentType);
            return _fileManagerService.GetFileUrl(document.Name, folder, isSecured);
        }

        public async Task<string> GetFileUrlAsync(Guid id)
        {
            var document = await _documentsRepository.GetAsync(id);
            return await GetFileUrlAsync(document);
        }

        public async Task<Document> CreateAsync(long userId, IFormFile file, DocumentType documentType)
        {
            var (folder, isSecured) = await GetFolderAsync(userId, documentType);
            string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(file.FileName)}";
            using (var stream = file.OpenReadStream())
            {
                var fileBytes = stream.GetAllBytes();
                await _fileManagerService.UploadAsync(fileName, file.ContentType, fileBytes, folder, isSecured);
            }

            var document = new Document()
            {
                Name = fileName,
                OriginalFileName = file.FileName,
                FileType = file.ContentType,
                DocumentType = documentType,
                Size = file.Length,
                CreatorUserId = userId,
            };

            return await _documentsRepository.InsertAsync(document);
        }

        public async Task DeleteAsync(Guid id)
        {
            var document = await _documentsRepository.GetAsync(id);
            var (folder, isSecured) = await GetFolderAsync(document.CreatorUserId.Value, document.DocumentType);
            await _fileManagerService.DeleteAsync(folder, document.Name, isSecured);
            await _documentsRepository.DeleteAsync(document);
        }

        private async Task<(string folder, bool isSecured)> GetFolderAsync(long userId, DocumentType documentType)
        {
            string folder;
            bool isSecured;
            switch (documentType)
            {
                case DocumentType.ProfilePicture:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_ProfilePictures);
                    isSecured = false;
                    break;
                case DocumentType.CoverPhoto:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos);
                    isSecured = false;
                    break;
                case DocumentType.Qualification:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Qualifications);
                    isSecured = true;
                    break;
                case DocumentType.Passport:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Passports);
                    isSecured = true;
                    break;
                case DocumentType.Education:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Educations);
                    isSecured = true;
                    break;
                case DocumentType.PhotoId:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_PhotoIds);
                    isSecured = true;
                    break;
                default:
                    folder = string.Empty;
                    isSecured = false;
                    break;
            }

            return ($"{userId}/{folder}", isSecured);
        }
    }
}
