using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseSections.Dto
{
    public class CourseSectionsAppService : AcademicallyAppServiceBase, ICourseSectionsAppService
    {
        private readonly IRepository<CourseSection, Guid> _courseSectionsRepository;

        public CourseSectionsAppService(IRepository<CourseSection, Guid> courseSectionsRepository)
        {
            _courseSectionsRepository = courseSectionsRepository;
        }

        public async Task<IEnumerable<CourseSectionDto>> GetAll(Guid courseId)
        {
            return await _courseSectionsRepository.GetAll()
                .Where(e => e.CourseId == courseId)
                .OrderBy(e => e.DisplayOrder)
                .Select(e => ObjectMapper.Map<CourseSectionDto>(e))
                .ToListAsync();
        }

        public async Task Create(CourseSectionDto input)
        {
            var course = ObjectMapper.Map<CourseSection>(input);
            course.Status = CourseSectionStatus.Draft;
            await _courseSectionsRepository.InsertAsync(course);
        }
    }
}
