using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.CourseAssignments.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Academically.Services.CourseAssignments
{
    public interface ICourseAssignmentsAppService : IApplicationService
    {
        Task<PagedResultDto<CourseAssignmentDto>> GetAll(PagedCourseAssignmentResultRequestDto input);
        Task CreateAsync([FromForm] CreateCourseAssingmentDto input);
    }
}
