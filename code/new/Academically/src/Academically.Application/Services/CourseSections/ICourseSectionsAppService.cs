using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.CourseSections.Dto;

namespace Academically.Services.CourseSections
{
    public interface ICourseSectionsAppService : IApplicationService
    {
        Task<IEnumerable<CourseSectionDto>> GetAll(Guid courseId);
        Task Create(CourseSectionDto input);
    }
}
