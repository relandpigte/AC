using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.CourseAssignments.Dto;
using Academically.Services.StudentCourses.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseAssignments
{
    public class CourseAssignmentsAppService : AcademicallyAppServiceBase, ICourseAssignmentsAppService
    {
        private readonly IRepository<CourseAssignment, Guid> _courseAssignmentsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public CourseAssignmentsAppService(
            IRepository<CourseAssignment, Guid> courseAssignmentsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _courseAssignmentsRepository = courseAssignmentsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<PagedResultDto<CourseAssignmentDto>> GetAllByStudent(PagedByStudentAssignmentResultRequestDto input)
        {
            var query = _courseAssignmentsRepository.GetAll()
                .Where(e => e.StudentCourseSection.StudentCourse.CourseId == input.CourseIdFilter && e.CreatorUserId == AbpSession.UserId.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Document.OriginalFileName.ToLower().Contains(input.SearchFilter.ToLower()));
            var totalCount = await query.CountAsync();
            var courseStudents = await query.OrderBy(input.Sorting)
                .Include(e => e.Document)
                .Include(e => e.CreatorUser)
                .Include(e => e.StudentCourseSection)
                    .ThenInclude(e => e.CourseSection)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<CourseAssignmentDto>(e))
                .ToListAsync();

            return new PagedResultDto<CourseAssignmentDto>()
            {
                TotalCount = totalCount,
                Items = courseStudents,
            };
        }

        public async Task<PagedResultDto<CourseAssignmentDto>> GetAllByCourse(PagedByCourseAssignmentResultRequestDto input)
        {
            var query = _courseAssignmentsRepository.GetAll()
                .Where(e => e.StudentCourseSection.StudentCourse.CourseId == input.CourseIdFilter)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Document.OriginalFileName.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.CourseSectionIdFilter.HasValue, e => e.StudentCourseSection.CourseSectionId == input.CourseSectionIdFilter.Value)
                .WhereIf(input.CreationTimeFilter.HasValue, e => e.CreationTime.Date == input.CreationTimeFilter.Value.Date);
            var totalCount = await query.CountAsync();
            var courseStudents = await query.OrderBy(input.Sorting)
                .Include(e => e.Document)
                .Include(e => e.CreatorUser)
                .Include(e => e.StudentCourseSection)
                    .ThenInclude(e => e.CourseSection)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<CourseAssignmentDto>(e))
                .ToListAsync();

            return new PagedResultDto<CourseAssignmentDto>()
            {
                TotalCount = totalCount,
                Items = courseStudents,
            };
        }

        public async Task<PagedResultDto<CourseAssignmentDto>> GetAll(PagedCourseAssignmentResultRequestDto input)
        {
            var query = _courseAssignmentsRepository.GetAll()
                .Where(e => e.StudentCourseSection.StudentCourseId == input.StudentCourseIdFilter)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Document.OriginalFileName.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.CourseSectionIdFilter.HasValue, e => e.StudentCourseSection.CourseSectionId == input.CourseSectionIdFilter.Value)
                .WhereIf(input.CreationTimeFilter.HasValue, e => e.CreationTime.Date == input.CreationTimeFilter.Value.Date);
            var totalCount = await query.CountAsync();
            var courseStudents = await query.OrderBy(input.Sorting)
                .Include(e => e.Document)
                .Include(e => e.CreatorUser)
                .Include(e => e.StudentCourseSection)
                    .ThenInclude(e => e.CourseSection)
                .PageBy(input)
                .Select(e => ObjectMapper.Map<CourseAssignmentDto>(e))
                .ToListAsync();

            return new PagedResultDto<CourseAssignmentDto>()
            {
                TotalCount = totalCount,
                Items = courseStudents,
            };
        }

        public async Task CreateAsync([FromForm] CreateCourseAssingmentDto input)
        {
            foreach (var file in input.Files)
            {
                var assignmentDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, file, DocumentType.CourseAssignment);
                var assignment = new CourseAssignment();
                assignment.StudentCourseSectionId = input.StudentCourseSectionId;
                assignment.DocumentId = assignmentDocument.Id;
                await _courseAssignmentsRepository.InsertAsync(assignment);
            }
        }
    }
}

