using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.StudentCourses.Dto;
using Academically.Users.Dto;

namespace Academically.Services.StudentCourses
{
    public interface IStudentCoursesAppService : IApplicationService
    {
        Task<PagedResultDto<StudentCourseDto>> GetAll(PagedStudentCourseResultRequestDto input);
        Task<PagedResultDto<StudentCourseDto>> GetAllStudents(PagedCourseStudentResultRequestDto input);
        Task<StudentCourseDto> Get(Guid id);
        Task<StudentCourseDto> GetByCourse(Guid courseId);
        Task<IEnumerable<UserDto>> GetRecentGraduates(Guid courseId);
        Task Create(Guid courseId);
        Task CreateCourseRatings(CreateCourseRatingDto input);
    }
}

