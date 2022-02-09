using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Videos.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

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
                .Include(e => e.ThumbnailDocument)
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
                .Include(e => e.ThumbnailDocument)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();

            return new PagedResultDto<VideoDto>()
            {
                TotalCount = totalCount,
                Items = videos,
            };
        }

        public async Task<PagedResultDto<VideoDto>> GetAllForHome(PagedResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
                .Where(e => e.ParentId == null);
            var totalCount = await query.CountAsync();
            var videos = await query.OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
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
                .Where(e => e.Id == id)
                .Include(e => e.Document)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Parent)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .FirstOrDefaultAsync();

            return video;
        }

        public async Task<GetDelayStatusDto> GetDelayStatus(Guid id)
        {
            var query = _videosRepository.GetAll()
                .Where(e => e.ParentId == id)
                .OrderBy(e => e.CreationTime);
            var firstVideo = await query.FirstOrDefaultAsync();
            return new GetDelayStatusDto()
            {
                IsFirstVideoPublished = firstVideo?.Status == VideoStatus.Published,
                VideoCount = await query.CountAsync(),
            };
        }

        public async Task<VideoDto> Create(VideoDto input)
        {
            var video = ObjectMapper.Map<Video>(input);
            input.Id = await _videosRepository.InsertAndGetIdAsync(video);
            return input;
        }

        public async Task<VideoDto> UpdateDetails(UpdateVideoDetailsDto input)
        {
            var video = await _videosRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, video);
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

        public async Task UpdateStatusAsync(Guid id, VideoStatus status)
        {
            var video = await _videosRepository.GetAsync(id);
            video.Status = status;
            await _videosRepository.UpdateAsync(video);
        }
    }
}

