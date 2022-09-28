using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Expressions;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.EntityFrameworkCore.Repositories.Explore;
using Academically.Extensions;
using Academically.Services.Explore.Dto;
using Academically.Services.Videos.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Videos
{
    public class VideosAppService : AcademicallyAppServiceBase, IVideosAppService
    {
        private readonly IRepository<Video, Guid> _videosRepository;
        private readonly IRepository<Reaction, Guid> _reactionsRepository;
        private readonly IRepository<StudentVideo, Guid> _studentVideoRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IExploreRepository _exploreRepository;

        public VideosAppService(
            IRepository<Video, Guid> videosRepository,
            IRepository<Reaction, Guid> reactionsRepository,
            IRepository<StudentVideo, Guid> studentVideoRepository,
            IDocumentsDomainService documentsDomainService,
            IExploreRepository exploreRepository
            )
        {
            _videosRepository = videosRepository;
            _reactionsRepository = reactionsRepository;
            _studentVideoRepository = studentVideoRepository;
            _documentsDomainService = documentsDomainService;
            _exploreRepository = exploreRepository;
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

            foreach (var video in videos)
            {
                video.LikeCount = await _reactionsRepository.CountAsync(e => e.ReferenceId == video.Id.ToString()
                    && e.Type == ReactionType.Like);
            }

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
            var videos = await query.PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();

            foreach (var video in videos)
            {
                video.LikeCount = await _reactionsRepository.CountAsync(e => e.ReferenceId == video.Id.ToString()
                    && e.Type == ReactionType.Like);
            }

            return new PagedResultDto<VideoDto>()
            {
                TotalCount = totalCount,
                Items = videos,
            };
        }

        public async Task<IEnumerable<VideoDto>> GetOtherVideosForSeries(Guid id)
        {
            var video = await _videosRepository.GetAsync(id);
            return await _videosRepository.GetAll()
                .Where(e => e.ParentId == video.ParentId && e.Id != video.Id)
                .Include(e => e.ThumbnailDocument)
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();
        }

        public async Task<PagedResultDto<VideoDto>> GetAllForHome(PagedResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
                .Where(e => e.ParentId == null)
                .Where(e => e.Status == VideoStatus.Published);
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

        public async Task<IEnumerable<VideoDto>> GetAllRelated(Guid id)
        {
            var video = await _videosRepository.GetAsync(id);
            if (!string.IsNullOrWhiteSpace(video.Categories))
            {
                var tags = video.Categories.Split(",").ToList();
                var tagsPredicate = PredicateBuilder.New<Video>();
                foreach (var tag in tags)
                {
                    tagsPredicate = tagsPredicate.Or(e => e.Categories.Contains(tag));
                }

                var relatedVideos = await _videosRepository.GetAll()
                    .Where(e => e.Id != video.Id)
                    .Where(tagsPredicate)
                    .Include(e => e.ThumbnailDocument)
                    .OrderBy(e => e.Name)
                    .Select(e => ObjectMapper.Map<VideoDto>(e))
                    .ToListAsync();
                return relatedVideos;
            }
            return new List<VideoDto>();
        }

        public async Task<VideoDto> Get(Guid id)
        {
            var video = await _videosRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.Document)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Parent)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
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

        public async Task DeleteAsync(Guid id)
        {
            var children = await _videosRepository.GetAll()
                .Where(e => e.ParentId == id)
                .ToListAsync();
            foreach (var child in children)
            {
                await _videosRepository.DeleteAsync(child.Id);
            }
            await _studentVideoRepository.DeleteAsync(sv => sv.VideoId == id);
            await _videosRepository.DeleteAsync(id);
        }

        public async Task<Dictionary<string, PagedResultDto<VideoDto>>> GetByTopicAsync(PagedExploreVideoResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
               .Where(e => e.ParentId == null)
               .Where(e => e.Status == VideoStatus.Published)
               //.WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId != input.UserIdFilter.Value)
               .WhereIf(input.MovingDate.HasValue, v => v.CreationTime < input.MovingDate);
            var totalCount = await query.CountAsync();
            var videos = await query.OrderBy(e => e.Name)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();


            foreach (var vid in videos)
            {
                if (vid.ThumbnailDocumentId.HasValue)
                    vid.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(vid.ThumbnailDocumentId.Value);
                if (vid.CreatorUser.ProfilePictureDocumentId.HasValue)
                    vid.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(vid.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return videos.GroupByTopicsPagedExt();
        }

        public async Task<Dictionary<string, PagedResultDto<VideoDto>>> GetByDatesAsync(PagedExploreVideoResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
                .Where(e => e.ParentId == null)
                .Where(e => e.Status == VideoStatus.Published)
                .Where(e => e.IsVisible)
                //.WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId != input.UserIdFilter.Value)
                .WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                .WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value)
                ;
            var totalCount = await query.CountAsync();
            var videos = await query.OrderBy(e => e.Name)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<VideoDto>(e))
                .ToListAsync();

            foreach (var vid in videos)
            {
                if (vid.ThumbnailDocumentId.HasValue)
                    vid.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(vid.ThumbnailDocumentId.Value);
                if (vid.CreatorUser.ProfilePictureDocumentId.HasValue)
                    vid.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(vid.CreatorUser.ProfilePictureDocumentId.Value);

                vid.LikeCount = await _reactionsRepository.CountAsync(e => e.ReferenceId == vid.Id.ToString()
                    && e.Type == ReactionType.Like);
                vid.VideoCount = vid.Children.Count();
            }

            return videos.GroupByDateRangePagedExt(input.Grain, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<VideoDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            var popularVideos = (await _exploreRepository.GetPopularVideos(input.SkipCount, input.MaxResultCount, input.UserIdFilter))
                    .Select(e => ObjectMapper.Map<VideoDto>(e))
                    .ToList();

            foreach (var vid in popularVideos)
            {
                if (vid.ThumbnailDocumentId.HasValue)
                    vid.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(vid.ThumbnailDocumentId.Value);
                if (vid.CreatorUser.ProfilePictureDocumentId.HasValue)
                    vid.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(vid.CreatorUser.ProfilePictureDocumentId.Value);

                vid.LikeCount = await _reactionsRepository.CountAsync(e => e.ReferenceId == vid.Id.ToString()
                    && e.Type == ReactionType.Like);
                vid.VideoCount = vid.Children.Count();
            }

            return popularVideos.GroupByPopularityPagedExt(input.MaxResultCount);
        }

    }
}

