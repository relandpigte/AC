using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
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
        Task CreateManyDisciplineTaxonomyStudyLevel(Guid disciplineTaxonomyId, IEnumerable<int> studyLevelIds);
        Task DeleteDisciplineTaxonomyStudyLevel(int id);
    }
}
