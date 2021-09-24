using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Services.Courses.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Courses)]
    public class CoursesAppService : AcademicallyAppServiceBase, ICoursesAppService
    {
        private readonly IRepository<Course, Guid> _coursesRepository;

        public CoursesAppService(
            IRepository<Course, Guid> coursesRepository
            )
        {
            _coursesRepository = coursesRepository;
        }

        public async Task<CourseDto> Get(Guid id)
        {
            var course = await _coursesRepository.GetAsync(id);
            return ObjectMapper.Map<CourseDto>(course);
        }

        public async Task<IEnumerable<CourseDto>> GetAll()
        {
            return await _coursesRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<CourseDto>(e))
                .ToListAsync();
        }

        public async Task Create(CourseDto input)
        {
            var course = ObjectMapper.Map<Course>(input);
            await _coursesRepository.InsertAsync(course);
        }

        public async Task<CourseDto> UpdateDetails(UpdateCourseDetailsDto input)
        {
            var course = await _coursesRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);
            await _coursesRepository.UpdateAsync(course);
            return ObjectMapper.Map<CourseDto>(course);
        }
    }
}
