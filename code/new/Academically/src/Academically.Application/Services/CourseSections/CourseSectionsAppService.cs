using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.CourseSections.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseSections
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
            var courseSectionModule = await _courseSectionsRepository.GetAll()
                .Where(e => e.CourseId == courseId && e.ParentId == null)
                .OrderBy(e => e.DisplayOrder)
                .Select(e => ObjectMapper.Map<CourseSectionDto>(e))
                .ToListAsync();
            var courseSctions = new List<CourseSectionDto>();
            foreach (var courseModule in courseSectionModule)
            {
                courseModule.Children = new List<CourseSectionDto>();
                courseModule.Children.AddRange(await GetCourseSectionChildren(courseModule.Id));
                foreach (var courseUnit in courseModule.Children)
                {
                    courseUnit.Children = new List<CourseSectionDto>();
                    courseUnit.Children.AddRange(await GetCourseSectionChildren(courseUnit.Id));
                }
                courseSctions.Add(courseModule);
            }
            return courseSctions;
        }

        public async Task<CourseSectionDto> Get(Guid id)
        {
            return await _courseSectionsRepository.GetAll()
                .Include(e => e.Course)
                .Where(e => e.Id == id)
                .Select(e => ObjectMapper.Map<CourseSectionDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task Create(CourseSectionDto input)
        {
            var course = ObjectMapper.Map<CourseSection>(input);
            course.Status = CourseSectionStatus.Draft;
            await _courseSectionsRepository.InsertAsync(course);
        }

        private async Task CreateDuplicateChild(CourseSection course, Guid? parentId)
        {
            var courseSectionParentCount = _courseSectionsRepository.GetAll().Where(e =>
                (parentId != null ? e.ParentId == parentId : e.ParentId == course.ParentId)
                && e.CourseId == course.CourseId).ToList().Count();
            var childList = _courseSectionsRepository.GetAll().Where(x => x.ParentId == course.Id).ToList();
            course.Id = new Guid();
            course.ParentId = (parentId != null) ? parentId : course.ParentId;
            course.Name = course.Name + " " + "(" + (courseSectionParentCount + 1) + ")";
            await _courseSectionsRepository.InsertAsync(course);
            foreach (var childitem in childList)
            {
                await CreateDuplicateChild(childitem, course.Id);
            }
        }

        private async Task<IEnumerable<CourseSectionDto>> GetCourseSectionChildren(Guid? parentId)
        {
            var courseSectionChild = await _courseSectionsRepository.GetAll()
                .Where(e => e.ParentId == parentId)
                .OrderBy(e => e.DisplayOrder)
                .Select(e => ObjectMapper.Map<CourseSectionDto>(e))
                .ToListAsync();
            return courseSectionChild;
        }
    }
}
