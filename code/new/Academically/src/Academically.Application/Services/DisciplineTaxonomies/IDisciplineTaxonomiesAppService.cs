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
        Task<DisciplineTaxonomyDto> Get(Guid id);
        Task<IEnumerable<DisciplineTaxonomyDto>> GetAll(GetAllDisciplineTaxonomyRequestDto request);
        Task<PagedResultDto<DisciplineTaxonomyDto>> GetAllPaged(PagedDisciplineTaxonomyResultRequestDto request);
        Task<IEnumerable<DisciplineTaxonomyDto>> Search(SearchDisciplineTaxonomyRequestDto request);
        Task<IEnumerable<DisciplineTaxonomyDto>> GetAllLastChildren(GetAllLastChildrenDisciplineTaxonomyRequestDto request);
        Task<IEnumerable<GetDisciplineTaxonomyChildrenCountDto>> GetChildrenCount(List<Guid> disciplineTaxonomyIds);
        Task<IEnumerable<GetDisciplineTaxonomyFollowerCountDto>> GetFollowerCount(List<Guid> disciplineTaxonomyIds);
    }
}
