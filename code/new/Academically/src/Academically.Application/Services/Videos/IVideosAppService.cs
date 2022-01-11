using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Services.Videos.Dto;

namespace Academically.Services.Videos
{
	public interface IVideosAppService
	{
		Task<PagedResultDto<VideoDto>> GetAll(PagedVideoResultRequestDto input);
		Task<PagedResultDto<VideoDto>> GetAllForSeries(PagedSeriesVideoResultRequestDto input);
		Task<VideoDto> Get(Guid id);
		Task<VideoDto> Create(VideoDto input);
		Task<VideoDto> UpdateDocument(UpdateVideoDto input);
		Task RemoveDocument(Guid id);
		Task<VideoDto> UpdateDetails(UpdateVideoDetailsDto input);
		Task<VideoDto> UpdateSettings(UpdateVideoSettingsDto input);
	}
}

