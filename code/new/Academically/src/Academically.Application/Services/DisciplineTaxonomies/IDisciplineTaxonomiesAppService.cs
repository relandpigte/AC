using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Articles.Dto;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.DisciplineTaxonomies
{
    public interface IDisciplineTaxonomiesAppService : IApplicationService
    {
        Task<IEnumerable<DisciplineTaxonomyDto>> GetAll(Guid? parentId, bool includeChildren, string sorting);
        Task<PagedResultDto<DisciplineTaxonomyDto>> GetAllPaged(PagedDisciplineTaxonomyResultRequestDto request);
        Task<IEnumerable<DisciplineTaxonomyDto>> GetAllLastChildren();
        Task<IEnumerable<GetDisciplineTaxonomyChildrenCountDto>> GetChildrenCount(List<Guid> disciplineTaxonomyIds);
        Task<IEnumerable<GetDisciplineTaxonomyFollowerCountDto>> GetFollowerCount(List<Guid> disciplineTaxonomyIds);
        Task<IEnumerable<DisciplineTaxonomyDto>> Search(string keyword, bool excludeFollowing);
    }
}
