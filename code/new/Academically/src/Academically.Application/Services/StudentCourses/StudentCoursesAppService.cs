using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.StudentCourses.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.StudentCourses
{
    public class StudentCoursesAppService : AcademicallyAppServiceBase, IStudentCoursesAppService
    {
        private readonly IRepository<StudentCourse, Guid> _studentCoursesRepository;

        public StudentCoursesAppService(
            IRepository<StudentCourse, Guid> studentCoursesRepository
            )
        {
            _studentCoursesRepository = studentCoursesRepository;
        }

        public async Task<StudentCourseDto> Get(Guid courseId)
        {
            return await _studentCoursesRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value && e.CourseId == courseId)
                .Select(e => ObjectMapper.Map<StudentCourseDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task Create(Guid courseId)
        {
            var studentCourse = new StudentCourse()
            {
                CourseId = courseId,
            };
            await _studentCoursesRepository.InsertAsync(studentCourse);
        }
    }
}

