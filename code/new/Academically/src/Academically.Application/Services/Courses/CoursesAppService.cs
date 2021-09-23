using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.Courses.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Courses)]
    public class CoursesAppService : AcademicallyAppServiceBase, ICoursesAppService
    {
        private readonly IRepository<Course, Guid> _coursesRepository;

        public CoursesAppService(IRepository<Course, Guid> coursesRepository)
        {
            _coursesRepository = coursesRepository;
        }
        public async Task<CourseDto> Create(CourseDto input)
        {
            var course = ObjectMapper.Map<Course>(input);
            course.CreatorUserId = AbpSession.UserId.Value;
            var response= await _coursesRepository.InsertAsync(course);
            return ObjectMapper.Map<CourseDto>(course);
        }
    }
}
