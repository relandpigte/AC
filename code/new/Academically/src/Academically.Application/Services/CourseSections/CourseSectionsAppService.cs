using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
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

        public async Task Delete(Guid id)
        {
            await _courseSectionsRepository.DeleteAsync(e => e.Parent.ParentId == id);
            await _courseSectionsRepository.DeleteAsync(e => e.ParentId == id);
            await _courseSectionsRepository.DeleteAsync(e => e.Id == id);
        }

        public async Task CreateDuplicate(CourseSectionDto input)
        {
            await DuplicateSectionChildren(new List<CourseSectionDto>() { input }, input.ParentId);
        }

        public async Task UpdateCourseSectionParent(Guid id, Guid? parentId, int newIndex)
        {
            var courseSection = await _courseSectionsRepository.GetAll()
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();

            //Update item's parent and displayorder here 
            courseSection.ParentId = parentId;
            courseSection.DisplayOrder = newIndex;

            _courseSectionsRepository.Update(courseSection);


            var parentElements = _courseSectionsRepository.GetAll()
                .Where(e => e.ParentId == courseSection.ParentId && e.Id != id).OrderBy(e => e.DisplayOrder).ToList();

            var _lastIndex = parentElements.IndexOf(parentElements.LastOrDefault());

            var sortedNodes = parentElements.Skip(newIndex - 1).Take((_lastIndex - (newIndex - 1)) + 1).ToList();

            for (int i = 1; i <= sortedNodes.Count; i++)
            {
                sortedNodes[i - 1].DisplayOrder = newIndex + i;
                await _courseSectionsRepository.UpdateAsync(sortedNodes[i - 1]);

            }
        }

        public async Task Update(CourseSectionDto input)
        {
            var course = ObjectMapper.Map<CourseSection>(input);
            course.CreatorUserId= AbpSession.UserId.Value;
            await _courseSectionsRepository.UpdateAsync(course);
        }

        private async Task DuplicateSectionChildren(IEnumerable<CourseSectionDto> inputs, Guid? parentId)
        {
            if (inputs != null && inputs.Any())
            {
                foreach (var input in inputs)
                {
                    var courseSection = ObjectMapper.Map<CourseSection>(input);
                    courseSection.Id = new Guid();
                    courseSection.ParentId = parentId;
                    courseSection.Name = GetDuplicateName(input.Name);
                    var childParentId = await _courseSectionsRepository.InsertAndGetIdAsync(courseSection);
                    await DuplicateSectionChildren(input.Children, childParentId);
                }
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

        private static string GetDuplicateName(string name)
        {
            var numericAppend = Regex.Match(name, @"\((\d+)\)[^(]*$").Groups[1].Value;
            if (numericAppend != "")
            {
                var oldNumericAppend = $"({numericAppend})";
                if (name.EndsWith(oldNumericAppend))
                {
                    int strToAppend = Convert.ToInt32(numericAppend);
                    return name.Replace(oldNumericAppend, $"({++strToAppend})");
                }
            }

            return $"{name} (1)";
        }
    }
}
