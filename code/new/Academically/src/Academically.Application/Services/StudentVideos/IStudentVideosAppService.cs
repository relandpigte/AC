using System;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Academically.Services.StudentVideos.Dto;

namespace Academically.Services.StudentVideos
{
	public interface IStudentVideosAppService
	{
		Task<PagedResultDto<StudentVideoDto>> GetAll(GetAllStudentVideoDto input);
		Task<StudentVideoDto> GetByVideo(Guid videoId);
		Task Create(Guid videoId);
	}
}

