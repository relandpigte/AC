using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Services.Videos.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Videos
{
    public class VideosAppService : AcademicallyAppServiceBase, IVideosAppService
    {
        private readonly IRepository<Video, Guid> _videosRepository;

        public VideosAppService(
            IRepository<Video, Guid> videosRepository
            )
        {
            _videosRepository = videosRepository;
        }

        public async Task<PagedResultDto<VideoDto>> GetAll(PagedVideoResultRequestDto input)
        {
            var query = _videosRepository.GetAll()
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
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
            var video = await _videosRepository.GetAsync(id);
            return ObjectMapper.Map<VideoDto>(video);
        }

        public async Task Create(VideoDto input)
        {
            var video = ObjectMapper.Map<Video>(input);
            await _videosRepository.InsertAsync(video);
        }
    }
}

