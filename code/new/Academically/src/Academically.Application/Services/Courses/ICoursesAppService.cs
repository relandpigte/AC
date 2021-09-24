using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Courses.Dto;

namespace Academically.Services.Courses
{
    public interface ICoursesAppService : IApplicationService
    {
        Task<CourseDto> Get(Guid id);
        Task<IEnumerable<CourseDto>> GetAll();
        Task Create(CourseDto input);
        Task<CourseDto> UpdateDetails(UpdateCourseDetailsDto input);
        Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input);
    }
}
