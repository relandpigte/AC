using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.StudentCourseSections.Dto;

namespace Academically.Services.StudentCourseSections
{
    public interface IStudentCourseSectionsAppService : IApplicationService
    {
        Task<IEnumerable<StudentCourseSectionDto>> GetAll(Guid courseId);
    }
}

