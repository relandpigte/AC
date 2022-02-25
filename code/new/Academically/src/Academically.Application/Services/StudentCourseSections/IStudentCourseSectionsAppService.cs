using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using Academically.Services.StudentCourseSections.Dto;

namespace Academically.Services.StudentCourseSections
{
    public interface IStudentCourseSectionsAppService : IApplicationService
    {
        Task<IEnumerable<StudentCourseSectionDto>> GetAll(Guid courseId);
        Task<PagedResultDto<StudentCourseSectionDto>> GetAllInProgress(GetAllInProgressStudentCourseSection input);
        Task<IEnumerable<StudentCourseSectionDto>> GetAssignmentsAllowed(Guid courseId);
        Task UpdateStatus(Guid id, StudentCourseSectionStatus status);
    }
}

