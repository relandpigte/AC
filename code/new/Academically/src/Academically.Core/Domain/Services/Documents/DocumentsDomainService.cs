using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.IO.Extensions;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

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
        private readonly IRepository<Coaching, Guid> _coachingsRepository;
        private readonly IRepository<CoachingResource, Guid> _coachingResourcesRepository;
        private readonly IFileManagerService _fileManagerService;

        public DocumentsDomainService(
            IRepository<Document, Guid> documentsRepository,
            IRepository<Video, Guid> videosRepository,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Event, Guid> eventsRepository,
            IRepository<CourseSection, Guid> courseSectionsRepository,
            IRepository<EventResource, Guid> eventResourcesRepository,
            IRepository<Coaching, Guid> coachingsRepository,
            IRepository<CoachingResource, Guid> coachingResourcesRepository,
            IFileManagerService fileManagerService
            )
        {
            _documentsRepository = documentsRepository;
            _videosRepository = videosRepository;
            _articlesRepository = articlesRepository;
            _eventsRepository = eventsRepository;
            _courseSectionsRepository = courseSectionsRepository;
            _eventResourcesRepository = eventResourcesRepository;
            _coachingsRepository = coachingsRepository;
            _coachingResourcesRepository = coachingResourcesRepository;
            _fileManagerService = fileManagerService;
        }

        public string GetBaseDirectory()
        {
            return _fileManagerService.GetRootPath();
        }

        public async Task<string> GetFileUrlAsync(Document document)
        {
            if(document == null)
            {
                return string.Empty;
            }

            var (folder, isSecured) = await GetFolderAsync(document.CreatorUserId.Value, document.DocumentType);
            if (isSecured)
                return _fileManagerService.GeneratePreSignedURL(document.Name, folder);
            return _fileManagerService.GeneratePublicFileUrl(document.Name, folder);
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

        private async Task<bool> UploadFile(long userId, string fileName, IFormFile file, DocumentType documentType)
        {
            var (folder, isSecured) = await GetFolderAsync(userId, documentType);
            using (var stream = file.OpenReadStream())
            {
                var fileBytes = stream.GetAllBytes();
                await _fileManagerService.UploadAsync(fileName, fileBytes, folder, isSecured);
            }
            return true;
        }

        public async Task<Document> CreateAsync(long userId, IFormFile file, DocumentType documentType)
        {
            string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(file.FileName)}";
            await this.UploadFile(userId, fileName, file, documentType);
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

        public async Task CreateAsync(Document document, Guid? referenceId, IFormFile? file)
        {
            if (file != null)
            {
                string fileName = $"{Clock.Now.Ticks}{Path.GetExtension(file.FileName)}";
                await this.UploadFile(document.CreatorUserId.Value, fileName, file, document.DocumentType);
                document.Name = fileName;
            }
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
                    case DocumentType.WorkshopThumbnail:
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
                    case DocumentType.WorkshopResource:
                        var eventResrouceReference = await _eventResourcesRepository.GetAsync(referenceId.Value);
                        eventResrouceReference.DocumentId = document.Id;
                        await _eventResourcesRepository.UpdateAsync(eventResrouceReference);
                        break;
                    case DocumentType.CoachingThumbnail:
                        var coachingThumbnailReference = await _coachingsRepository.GetAsync(referenceId.Value);
                        coachingThumbnailReference.ThumbnailDocumentId = document.Id;
                        await _coachingsRepository.UpdateAsync(coachingThumbnailReference);
                        break;
                    case DocumentType.CoachingResource:
                        var coachingResourceReference = await _coachingResourcesRepository.GetAsync(referenceId.Value);
                        coachingResourceReference.DocumentId = document.Id;
                        await _coachingResourcesRepository.UpdateAsync(coachingResourceReference);
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
                    case DocumentType.WorkshopThumbnail:
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
                    case DocumentType.WorkshopResource:
                        var eventResourceReference = await _eventResourcesRepository.GetAsync(referenceId.Value);
                        eventResourceReference.DocumentId = null;
                        await _eventResourcesRepository.UpdateAsync(eventResourceReference);
                        break;
                    case DocumentType.CoachingThumbnail:
                        var coachingThumbnailReference = await _coachingsRepository.GetAsync(referenceId.Value);
                        coachingThumbnailReference.ThumbnailDocumentId = null;
                        await _coachingsRepository.UpdateAsync(coachingThumbnailReference);
                        break;
                    case DocumentType.CoachingResource:
                        var coachingResourceReference = await _coachingResourcesRepository.GetAsync(referenceId.Value);
                        coachingResourceReference.DocumentId = null;
                        await _coachingResourcesRepository.UpdateAsync(coachingResourceReference);
                        break;
                }
            }
            await this.DeleteAsync(id);
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
                case DocumentType.CoachingThumbnail:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoachingThumbnails);
                    isSecured = false;
                    break;
                case DocumentType.EventThumbnail:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_EventThumbnails);
                    isSecured = false;
                    break;
                case DocumentType.WorkshopThumbnail:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_WorkshopThumbnails);
                    isSecured = false;
                    break;
                case DocumentType.PostAttachment:
                    folder = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_WorkshopThumbnails);
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
