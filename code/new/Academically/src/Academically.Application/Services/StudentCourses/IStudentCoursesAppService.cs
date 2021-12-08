using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.StudentCourses.Dto;

namespace Academically.Services.StudentCourses
{
    public interface IStudentCoursesAppService : IApplicationService
    {
        Task<PagedResultDto<StudentCourseDto>> GetAll(PagedStudentCourseResultRequestDto input);
        Task<PagedResultDto<StudentCourseDto>> GetAllStudents(PagedCourseStudentResultRequestDto input);
        Task<StudentCourseDto> Get(Guid id);
        Task<StudentCourseDto> GetByCourse(Guid courseId);
        Task Create(Guid courseId);
    }
}

