using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.Videos.Dto;

namespace Academically.Services.Videos
{
	public interface IVideosAppService
	{
		Task<PagedResultDto<VideoDto>> GetAll(PagedVideoResultRequestDto input);
		Task<PagedResultDto<VideoDto>> GetAllForSeries(PagedSeriesVideoResultRequestDto input);
		Task<VideoDto> Get(Guid id);
		Task<GetDelayStatusDto> GetDelayStatus(Guid id);
		Task<VideoDto> Create(VideoDto input);
		Task<VideoDto> UpdateDetails(UpdateVideoDetailsDto input);
		Task<VideoDto> UpdateSettings(UpdateVideoSettingsDto input);
		Task UpdateStatusAsync(Guid id, VideoStatus status);
	}
}

