using Abp.Application.Services;
using Academically.Services.Courses.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Courses
{
    public interface ICoursesAppService : IApplicationService
    {
        Task<CourseDto> Create(CourseDto course);
    }
}
