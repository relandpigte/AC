using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Documents.Dto;
using Academically.Services.Videos.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Videos
{
    public class VideosAppService : AcademicallyAppServiceBase, IVideosAppService
    {
        private readonly IRepository<Video, Guid> _videosRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public VideosAppService(
            IRepository<Video, Guid> videosRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _videosRepository = videosRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<PagedResultDto<VideoDto>> GetAll(PagedVideoResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
                .Where(e => e.ParentId == null)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StausFilter.HasValue, e => e.Status == input.StausFilter.Value);
            var totalCount = await query.CountAsync();
            var videos = await query.OrderBy(e => e.Name)
                .PageBy(input)
                .Include(e => e.Children)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();

            return new PagedResultDto<VideoDto>()
            {
                TotalCount = totalCount,
                Items = videos,
            };
        }

        public async Task<PagedResultDto<VideoDto>> GetAllForSeries(PagedSeriesVideoResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StausFilter.HasValue, e => e.Status == input.StausFilter.Value);
            var totalCount = await query.CountAsync();
            var videos = await query.OrderBy(e => e.Name)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();

            return new PagedResultDto<VideoDto>()
            {
                TotalCount = totalCount,
                Items = videos,
            };
        }

        public async Task<VideoDto> Get(Guid id)
        {
            var video = await _videosRepository.GetAll()
                .Include(e => e.Document)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Parent)
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();
            var output = ObjectMapper.Map<VideoDto>(video);
            if (video.Document != null)
            {
                output.VideoUrl = await _documentsDomainService.GetFileUrlAsync(video.Document);
            }

            if (video.ThumbnailDocument != null)
            {
                output.ThumbnailUrl = await _documentsDomainService.GetFileUrlAsync(video.ThumbnailDocument);
            }
            
            return output;
        }

        public async Task<VideoDto> Create(VideoDto input)
        {
            var video = ObjectMapper.Map<Video>(input);
            input.Id = await _videosRepository.InsertAndGetIdAsync(video);
            return input;
        }

        public async Task<VideoDto> UpdateDocument([FromForm] UpdateVideoDto input)
        {
            long userId = AbpSession.UserId.Value;
            var video = await _videosRepository.GetAsync(input.Id);
            var previousVideoDocumentId = video.DocumentId;
            var videoDocument = await _documentsDomainService.CreateAsync(userId, input.File, DocumentType.Video);
            video.DocumentId = videoDocument.Id;

            if (previousVideoDocumentId.HasValue)
            {
                await _documentsDomainService.DeleteAsync(previousVideoDocumentId.Value);
            }

            await _videosRepository.UpdateAsync(video);
            var output = ObjectMapper.Map<VideoDto>(video);
            output.VideoUrl = await _documentsDomainService.GetFileUrlAsync(videoDocument);
            output.Document = ObjectMapper.Map<DocumentDto>(videoDocument);
            return output;
        }

        public async Task RemoveDocument(Guid id)
        {
            var video = await _videosRepository.GetAsync(id);
            if (video.DocumentId.HasValue)
            {
                var documentId = video.DocumentId.Value;
                video.DocumentId = null;
                await _videosRepository.UpdateAsync(video);
                await _documentsDomainService.DeleteAsync(documentId);
            }
        }

        public async Task<VideoDto> UpdateDetails([FromForm] UpdateVideoDetailsDto input)
        {
            var video = await _videosRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, video);

            if (input.ThumbnailFile != null)
            {
                var oldDocumentId = video.ThumbnailDocumentId;
                var videoThumbnailDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.ThumbnailFile, DocumentType.VideoThumbnail);
                video.ThumbnailDocumentId = videoThumbnailDocument.Id;

                if (oldDocumentId.HasValue)
                {
                    await _documentsDomainService.DeleteAsync(oldDocumentId.Value);
                }
            }

            await _videosRepository.UpdateAsync(video);
            return ObjectMapper.Map<VideoDto>(video);
        }

        public async Task<VideoDto> UpdateSettings(UpdateVideoSettingsDto input)
        {
            var video = await _videosRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, video);
            await _videosRepository.UpdateAsync(video);
            return ObjectMapper.Map<VideoDto>(video);
        }
    }
}

