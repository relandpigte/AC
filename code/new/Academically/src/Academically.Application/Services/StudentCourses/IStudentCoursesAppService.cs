using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.StudentCourses.Dto;

namespace Academically.Services.StudentCourses
{
    public interface IStudentCoursesAppService : IApplicationService
    {
        Task<StudentCourseDto> Get(Guid courseId);
        Task Create(Guid courseId);
    }
}

