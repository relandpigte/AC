using Abp.Application.Services;
using Academically.Services.DisciplineTaxonomyStudyLevels.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.DisciplineTaxonomyStudyLevels
{
    public interface IDisciplineTaxonomyStudyLevelsAppService : IApplicationService
    {
        Task<IEnumerable<DisciplineTaxonomyStudyLevelDto>> GetAll(long? userId, Guid? disciplineTaxonomyId);
        Task<IEnumerable<DisciplineTaxonomyStudyLevelDto>> GetUserDisciplineTaxonomyStudyLevels(long userId, Guid disciplineTaxonomyId);
        Task CreateManyDisciplineTaxonomyStudyLevel(Guid disciplineTaxonomyId, IEnumerable<int> studyLevelIds);
        Task DeleteDisciplineTaxonomyStudyLevel(int id);
    }
}
