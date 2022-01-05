using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Services.Videos.Dto;

namespace Academically.Services.Videos
{
	public interface IVideosAppService
	{
		Task<PagedResultDto<VideoDto>> GetAll(PagedVideoResultRequestDto input);
		Task<VideoDto> Get(Guid id);
		Task Create(VideoDto input);
	}
}

