using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.CourseSectionPages.Dto;

namespace Academically.Services.CourseSectionPages
{
    public interface ICourseSectionPagesAppService : IApplicationService
    {
        Task<CourseSectionPageDto> Get(Guid courseSectionId);
        Task Save(CourseSectionPageDto input);
    }
}
