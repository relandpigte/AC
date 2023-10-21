using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;
using Academically.Services.Videos.Dto;

namespace Academically.Services.Videos
{
    public interface IVideosAppService
    {
        Task<PagedResultDto<VideoDto>> GetAll(PagedVideoResultRequestDto input);
        Task<IEnumerable<AvailableServiceDto>> GetAllVideos();
        Task<IEnumerable<AvailableServiceDto>> GetVideosByKeyword(string keyword, long? creatorUserId);
        Task<PagedResultDto<VideoDto>> GetAllForSeries(PagedSeriesVideoResultRequestDto input);
        Task<IEnumerable<VideoDto>> GetOtherVideosForSeries(Guid id);
        Task<PagedResultDto<VideoDto>> GetAllForHome(PagedResultRequestDto input);
        Task<IEnumerable<VideoDto>> GetAllRelated(Guid id);
        Task<VideoDto> Get(Guid id);
        Task<GetDelayStatusDto> GetDelayStatus(Guid id);
        Task<VideoDto> Create(VideoDto input);
        Task<VideoDto> UpdateDetails(UpdateVideoDetailsDto input);
        Task<VideoDto> UpdateSettings(UpdateVideoSettingsDto input);
        Task UpdateStatusAsync(Guid id, VideoStatus status);
        Task DeleteAsync(Guid id);
        Task<IEnumerable<VideoDto>> GetEnrolledVideosByUser();
    }
}

