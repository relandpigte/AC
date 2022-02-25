using System;
using Abp.Application.Services.Dto;

namespace Academically.Services.StudentVideos.Dto
{
	public class GetAllStudentVideoDto : PagedResultRequestDto
	{
        public bool IsSavedFilter { get; set; }
    }
}

