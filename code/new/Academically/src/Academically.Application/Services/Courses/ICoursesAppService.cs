using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Courses.Dto;
using Academically.Services.Posts.Dto;

namespace Academically.Services.Courses
{
    public interface ICoursesAppService : IAsyncCrudAppService<CourseDto, Guid, PagedCourseResultRequestDto, CreateCourseDto, CourseDto>
    {
        Task<CourseDto> UpdateDetails(UpdateCourseDetailsDto input);
        Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input);
        Task<IEnumerable<AvailableServiceDto>> GetAllCourses();
        Task<IEnumerable<AvailableServiceDto>> GetCoursesByKeyword(string keyword, long? creatorUserId);
        Task<IEnumerable<CourseDto>> GetEnrolledCoursesByUser(long? userId);
    }
}
