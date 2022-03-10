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
        private readonly IRepository<Video, Guid> _videosRepository;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Event, Guid> _eventsRepository;
        private readonly IRepository<CourseSection, Guid> _courseSectionsRepository;
        private readonly IRepository<EventResource, Guid> _eventResourcesRepository;
        private readonly IFileManagerService _fileManagerService;

        public DocumentsDomainService(
            IRepository<Document, Guid> documentsRepository,
            IRepository<Video, Guid> videosRepository,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Event, Guid> eventsRepository,
            IRepository<CourseSection, Guid> courseSectionsRepository,
            IRepository<EventResource, Guid> eventResourcesRepository,
            IFileManagerService fileManagerService
            )
        {
            _documentsRepository = documentsRepository;
            _videosRepository = videosRepository;
            _articlesRepository = articlesRepository;
            _eventsRepository = eventsRepository;
            _courseSectionsRepository = courseSectionsRepository;
            _eventResourcesRepository = eventResourcesRepository;
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

        public async Task<Document> GetAsync(Guid id)
        {
            return await _documentsRepository.GetAsync(id);
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

        public async Task CreateAsync(Document document, Guid? referenceId)
        {
            await _documentsRepository.InsertAsync(document);
            if (referenceId.HasValue)
            {
                switch (document.DocumentType)
                {
                    case DocumentType.Video:
                        var videoReference = await _videosRepository.GetAsync(referenceId.Value);
                        videoReference.DocumentId = document.Id;
                        await _videosRepository.UpdateAsync(videoReference);
                        break;
                    case DocumentType.VideoThumbnail:
                        var videoThumbnailReference = await _videosRepository.GetAsync(referenceId.Value);
                        videoThumbnailReference.ThumbnailDocumentId = document.Id;
                        await _videosRepository.UpdateAsync(videoThumbnailReference);
                        break;
                    case DocumentType.ArticleThumbnail:
                        var articleThumbnailReference = await _articlesRepository.GetAsync(referenceId.Value);
                        articleThumbnailReference.ThumbnailDocumentId = document.Id;
                        await _articlesRepository.UpdateAsync(articleThumbnailReference);
                        break;
                    case DocumentType.EventThumbnail:
                        var eventThumbnailReference = await _eventsRepository.GetAsync(referenceId.Value);
                        eventThumbnailReference.ThumbnailDocumentId = document.Id;
                        await _eventsRepository.UpdateAsync(eventThumbnailReference);
                        break;
                    case DocumentType.CourseSectionImage:
                        var courseSectionImageReference = await _courseSectionsRepository.GetAsync(referenceId.Value);
                        courseSectionImageReference.ImageDocumentId = document.Id;
                        await _courseSectionsRepository.UpdateAsync(courseSectionImageReference);
                        break;
                    case DocumentType.EventResource:
                        var eventResrouceReference = await _eventResourcesRepository.GetAsync(referenceId.Value);
                        eventResrouceReference.DocumentId = document.Id;
                        await _eventResourcesRepository.UpdateAsync(eventResrouceReference);
                        break;
                }
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var document = await _documentsRepository.GetAsync(id);
            var (folder, isSecured) = await GetFolderAsync(document.CreatorUserId.Value, document.DocumentType);
            await _fileManagerService.DeleteAsync(folder, document.Name, isSecured);
            await _documentsRepository.DeleteAsync(document);
        }

        public async Task DeleteReferenceAsync(Guid id, Guid? referenceId)
        {
            var document = await _documentsRepository.GetAsync(id);
            if (referenceId.HasValue)
            {
                switch (document.DocumentType)
                {
                    case DocumentType.Video:
                        var videoReference = await _videosRepository.GetAsync(referenceId.Value);
                        videoReference.DocumentId = null;
                        await _videosRepository.UpdateAsync(videoReference);
                        break;
                    case DocumentType.VideoThumbnail:
                        var videoThumbnailReference = await _videosRepository.GetAsync(referenceId.Value);
                        videoThumbnailReference.ThumbnailDocumentId = null;
                        await _videosRepository.UpdateAsync(videoThumbnailReference);
                        break;
                    case DocumentType.ArticleThumbnail:
                        var articleThumbnailReference = await _articlesRepository.GetAsync(referenceId.Value);
                        articleThumbnailReference.ThumbnailDocumentId = null;
                        await _articlesRepository.UpdateAsync(articleThumbnailReference);
                        break;
                    case DocumentType.EventThumbnail:
                        var eventThumbnailReference = await _eventsRepository.GetAsync(referenceId.Value);
                        eventThumbnailReference.ThumbnailDocumentId = null;
                        await _eventsRepository.UpdateAsync(eventThumbnailReference);
                        break;
                    case DocumentType.CourseSectionImage:
                        var courseSectionImageReference = await _courseSectionsRepository.GetAsync(referenceId.Value);
                        courseSectionImageReference.ImageDocumentId = null;
                        await _courseSectionsRepository.UpdateAsync(courseSectionImageReference);
                        break;
                    case DocumentType.EventResource:
                        var eventResourceReference = await _eventResourcesRepository.GetAsync(referenceId.Value);
                        eventResourceReference.DocumentId = null;
                        await _eventResourcesRepository.UpdateAsync(eventResourceReference);
                        break;
                }
            }
            await _documentsRepository.DeleteAsync(id);
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
                case DocumentType.Reference:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_References);
                    isSecured = true;
                    break;
                case DocumentType.DbsCertificate:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_DbsCertificates);
                    isSecured = true;
                    break;
                case DocumentType.IntroVideo:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_IntroVideos);
                    isSecured = false;
                    break;
                case DocumentType.Conversation:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Conversations);
                    isSecured = true;
                    break;
                case DocumentType.CourseImage:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CourseImages);
                    isSecured = false;
                    break;
                case DocumentType.CourseSectionPage:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CourseSectionPage);
                    isSecured = false;
                    break;
                case DocumentType.CourseAssignment:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CourseAssignments);
                    isSecured = false;
                    break;
                case DocumentType.Video:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Videos);
                    isSecured = false;
                    break;
                case DocumentType.VideoThumbnail:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_VideoThumbnails);
                    isSecured = false;
                    break;
                case DocumentType.ArticleThumbnail:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_ArticleThumbnails);
                    isSecured = false;
                    break;
                case DocumentType.CourseSectionImage:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CourseSectionImages);
                    isSecured = false;
                    break;
                case DocumentType.EventThumbnail:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_EventThumbnails);
                    isSecured = false;
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
