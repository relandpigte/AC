using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Courses.Dto;

namespace Academically.Services.Courses
{
    public interface ICoursesAppService : IAsyncCrudAppService<CourseDto, Guid, PagedCourseResultRequestDto, CreateCourseDto, CourseDto>
    {
        Task<CourseDto> UpdateDetails(UpdateCourseDetailsDto input);
        Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input);
        IQueryable<CourseDto> GetAllCourses();
        IQueryable<CourseDto> GetCoursesByKeyword(string keyword = "");
    }
}
