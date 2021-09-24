using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Courses.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Courses
{
    [AbpAuthorize(PermissionNames.Pages_Courses)]
    public class CoursesAppService : AcademicallyAppServiceBase, ICoursesAppService
    {
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public CoursesAppService(
            IRepository<Course, Guid> coursesRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _coursesRepository = coursesRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<CourseDto> Get(Guid id)
        {
            var course = await _coursesRepository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.ImageDocument)
                .FirstOrDefaultAsync();
            var output = ObjectMapper.Map<CourseDto>(course);
            output.CourseImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocument);
            return output;
        }

        public async Task<IEnumerable<CourseDto>> GetAll()
        {
            var courses = await _coursesRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.ImageDocument)
                .OrderBy(e => e.Name)
                .ToListAsync();

            var outputs = new List<CourseDto>();
            foreach (var course in courses)
            {
                var output = ObjectMapper.Map<CourseDto>(course);
                output.CourseImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocument);
                outputs.Add(output);
            }

            return outputs;
        }

        public async Task Create(CourseDto input)
        {
            var course = ObjectMapper.Map<Course>(input);
            await _coursesRepository.InsertAsync(course);
        }

        public async Task<CourseDto> UpdateDetails([FromForm] UpdateCourseDetailsDto input)
        {
            var course = await _coursesRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);

            if (input.File != null)
            {
                var oldDocumentId = course.ImageDocumentId;
                var courseImageDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.CourseImage);
                course.ImageDocumentId = courseImageDocument.Id;

                if (oldDocumentId.HasValue)
                {
                    await _documentsDomainService.DeleteAsync(oldDocumentId.Value);
                }
            }

            await _coursesRepository.UpdateAsync(course);
            return ObjectMapper.Map<CourseDto>(course);
        }

        public async Task<CourseDto> UpdateSettings(UpdateCourseSettingsDto input)
        {
            var course = await _coursesRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, course);
            course.Type = CourseType.Standard;
            await _coursesRepository.UpdateAsync(course);
            return ObjectMapper.Map<CourseDto>(course);
        }
    }
}
