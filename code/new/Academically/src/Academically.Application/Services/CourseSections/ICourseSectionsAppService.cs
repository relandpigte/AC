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
        Task<CourseSectionDto> Get(Guid id);
        Task Create(CourseSectionDto input);
        Task CreateDuplicate(CourseSectionDto input);
        Task Delete(Guid id);
    }
}
