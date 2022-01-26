using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.CourseSections.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseSections
{
    public class CourseSectionsAppService : AcademicallyAppServiceBase, ICourseSectionsAppService
    {
        private readonly IRepository<CourseSection, Guid> _courseSectionsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public CourseSectionsAppService(
            IRepository<CourseSection, Guid> courseSectionsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _courseSectionsRepository = courseSectionsRepository;
            _documentsDomainService = documentsDomainService;
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
            var courseSection = await _courseSectionsRepository.GetAll()
                .Include(e => e.Course)
                .Include(e => e.ImageDocument)
                .Where(e => e.Id == id)
                .FirstOrDefaultAsync();
            var output = ObjectMapper.Map<CourseSectionDto>(courseSection);

            if (courseSection.ImageDocument != null)
            {
                output.ImageDocumentUrl = await _documentsDomainService.GetFileUrlAsync(courseSection.ImageDocument);
            }

            return output;
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
            if (courseSection != null)
            {

                //Update item's parent and displayorder here 
                courseSection.ParentId = parentId;
                courseSection.DisplayOrder = newIndex;

                _courseSectionsRepository.Update(courseSection);


                var parentElements = _courseSectionsRepository.GetAll()
                    .Where(e => e.ParentId == courseSection.ParentId && e.CourseId == courseSection.CourseId && e.Id != id).OrderBy(e => e.DisplayOrder).ToList();

                var _lastIndex = parentElements.IndexOf(parentElements.LastOrDefault());

                var sortedNodes = parentElements.Skip(newIndex - 1).Take((_lastIndex - (newIndex - 1)) + 1).ToList();

                for (int i = 1; i <= sortedNodes.Count; i++)
                {
                    sortedNodes[i - 1].DisplayOrder = newIndex + i;
                    await _courseSectionsRepository.UpdateAsync(sortedNodes[i - 1]);
                }
            }
        }

        public async Task Update(CourseSectionDto input)
        {
            var course = ObjectMapper.Map<CourseSection>(input);
            course.CreatorUserId = AbpSession.UserId.Value;
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

        public async Task<CourseSectionDto> UpdateDetails([FromForm] UpdateCourseSectionDetailsDto input)
        {
            var courseSection = await _courseSectionsRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, courseSection);

            if (input.ImageDocumentFile != null)
            {
                var oldDocumentId = courseSection.ImageDocumentId;
                var document = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.ImageDocumentFile, DocumentType.CourseSectionImage);
                courseSection.ImageDocumentId = document.Id;

                if (oldDocumentId.HasValue)
                {
                    await _documentsDomainService.DeleteAsync(oldDocumentId.Value);
                }
            }

            await _courseSectionsRepository.UpdateAsync(courseSection);
            return ObjectMapper.Map<CourseSectionDto>(courseSection);
        }

        public async Task<CourseSectionDto> UpdateSettings(UpdateCourseSectionSettingsDto input)
        {
            var courseSection = await _courseSectionsRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, courseSection);
            await _courseSectionsRepository.UpdateAsync(courseSection);
            return ObjectMapper.Map<CourseSectionDto>(courseSection);
        }
    }
}
