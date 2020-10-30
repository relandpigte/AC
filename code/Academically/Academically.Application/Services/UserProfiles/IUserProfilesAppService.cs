using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.ResearchMethods.Dto;
using Academically.Services.SupportServices.Dto;
using Academically.Services.UserProfiles.Dto;

namespace Academically.Services.UserProfiles
{
    public interface IUserProfilesAppService : IApplicationService
    {
        Task<GetProfileDetailDto> GetDetail(long userId);
        Task SaveDetail(SaveProfileDetailDto input);

        Task<IEnumerable<GetUserDisciplineTaxonomyDto>> GetDisciplineTaxonomies(long userId);
        Task CreateManyDisciplineTaxonomy(IEnumerable<Guid> disciplineTaxonomyIds);
        Task DeleteDisciplineTaxonomy(Guid userDisciplineTaxonomyId);

        Task<IEnumerable<ResearchMethodDto>> GetResearchMethods(long userId);
        Task CreateManyResearchMethods(IEnumerable<Guid> researchMethodIds);
        Task DeleteResearchMethod(long userId, Guid researchMethodId);

        Task<IEnumerable<SupportServiceDto>> GetSupportServices(long userId);
        Task CreateManySupportServices(IEnumerable<Guid> supportServiceIds);
        Task DeleteSupportService(long userId, Guid supportServiceId);
    }
}
