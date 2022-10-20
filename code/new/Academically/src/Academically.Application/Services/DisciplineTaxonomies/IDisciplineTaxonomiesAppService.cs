using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.DisciplineTaxonomies
{
    public interface IDisciplineTaxonomiesAppService : IApplicationService
    {
        Task<IEnumerable<DisciplineTaxonomyDto>> GetAll(Guid? parentId, bool includeChildren);
        Task<IEnumerable<DisciplineTaxonomyDto>> GetAllLastChildren();
        Task<IEnumerable<DisciplineTaxonomyDto>> Search(string keyword);
    }
}
