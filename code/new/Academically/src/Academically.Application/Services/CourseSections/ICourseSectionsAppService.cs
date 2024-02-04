using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
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
        Task UpdateCourseSectionParent(Guid id, Guid? parentId, int newIndex);
        Task Update(CourseSectionDto input);
        Task<CourseSectionDto> UpdateDetails(UpdateCourseSectionDetailsDto input);
        Task<CourseSectionDto> UpdateSettings(UpdateCourseSectionSettingsDto input);
        Task<bool> FlatCourseCurriculum(Guid id, string targetType);
    }
}
