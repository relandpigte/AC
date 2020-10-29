using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.DisciplineTaxonomyStudyLevels.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.DisciplineTaxonomyStudyLevels
{
    public class DisciplineTaxonomyStudyLevelsAppService : AcademicallyAppServiceBase, IDisciplineTaxonomyStudyLevelsAppService
    {
        private readonly IRepository<DisciplineTaxonomyStudylevel, int> _disciplineTaxonomyStudyLevelsRepository;
        private readonly IRepository<UserDisciplineTaxonomyStudyLevel, int> _userDisciplineTaxonomystudyLevelsRepository;

        public DisciplineTaxonomyStudyLevelsAppService(
            IRepository<DisciplineTaxonomyStudylevel, int> disciplineTaxonomyStudyLevelsRepository,
            IRepository<UserDisciplineTaxonomyStudyLevel, int> userDisciplineTaxonomystudyLevelsRepository
            )
        {
            _disciplineTaxonomyStudyLevelsRepository = disciplineTaxonomyStudyLevelsRepository;
            _userDisciplineTaxonomystudyLevelsRepository = userDisciplineTaxonomystudyLevelsRepository;
        }

        public async Task<IEnumerable<DisciplineTaxonomyStudyLevelDto>> GetAll(long? userId)
        {
            var disciplineStudyLevels = new List<DisciplineTaxonomyStudyLevelDto>();

            if (userId.HasValue)
            {
                var userDiscplineStudyLevels = GetUserDisciplineTaxonomyStudyLevels(userId.Value);
                disciplineStudyLevels = await _disciplineTaxonomyStudyLevelsRepository.GetAll()
                    .Where(e => !userDiscplineStudyLevels.Any(t => t == e.Id))
                    .Select(e => ObjectMapper.Map<DisciplineTaxonomyStudyLevelDto>(e))
                    .ToListAsync();
            }
            else
            {
                disciplineStudyLevels = await _disciplineTaxonomyStudyLevelsRepository.GetAll()
                    .Select(e => ObjectMapper.Map<DisciplineTaxonomyStudyLevelDto>(e))
                    .ToListAsync();
            }

            return disciplineStudyLevels;
        }

        private IQueryable<int> GetUserDisciplineTaxonomyStudyLevels(long userId)
        {
            return _userDisciplineTaxonomystudyLevelsRepository.GetAll()
                .Where(e => e.UserId == userId)
                .Select(e => e.LevelId);
        }
    }
}
