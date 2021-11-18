using Abp.Application.Services;
using Academically.Services.Courses.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Courses
{
    public interface ICoursesAppService : IAsyncCrudAppService<CourseDto, Guid, PagedCourseResultRequestDto, CreateCourseDto, CourseDto>
    {
        Task<CourseDto> UpdateDetails(UpdateCourseDetailsDto input);
        Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input);
    }
}
