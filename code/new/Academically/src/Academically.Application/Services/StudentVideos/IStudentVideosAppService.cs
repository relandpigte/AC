using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.StudentVideos.Dto;

namespace Academically.Services.StudentVideos
{
	public interface IStudentVideosAppService : IApplicationService
	{
		Task<PagedResultDto<StudentVideoDto>> GetAllAsync(GetAllStudentVideoDto input);
		Task<GetStudentVideoDto> GetByVideoAsync(Guid videoId);
		Task CreateAsync(StudentVideoDto input);
		Task DeleteAsync(Guid id);
	}
}

