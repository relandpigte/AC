using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.DisciplineTaxonomies
{
    public interface IDisciplineTaxonomiesAppService : IApplicationService
    {
        Task<IEnumerable<GetAllDisciplineTaxonomyDto>> GetAll(long? userId);
        Task<IEnumerable<DisciplineTaxonomyDto>> Search(long? userId, string keyword);
    }
}
