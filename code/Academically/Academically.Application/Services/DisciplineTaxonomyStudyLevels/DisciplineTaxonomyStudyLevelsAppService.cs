using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
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

        public async Task<IEnumerable<DisciplineTaxonomyStudyLevelDto>> GetAll(long? userId, Guid? disciplineTaxonomyId)
        {
            var disciplineStudyLevels = new List<DisciplineTaxonomyStudyLevelDto>();

            if (userId.HasValue)
            {
                var userDiscplineStudyLevels = GetUserDisciplineTaxonomyStudyLevelIds(userId.Value, disciplineTaxonomyId.Value);
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


        public async Task<IEnumerable<DisciplineTaxonomyStudyLevelDto>> GetUserDisciplineTaxonomyStudyLevels(long userId, Guid disciplineTaxonomyId)
        {
            var disciplineStudyLevels = new List<DisciplineTaxonomyStudyLevelDto>();

            var userDiscplineStudyLevels = GetUserDisciplineTaxonomyStudyLevelIds(userId, disciplineTaxonomyId);
            disciplineStudyLevels = await _disciplineTaxonomyStudyLevelsRepository.GetAll()
                .Where(e => userDiscplineStudyLevels.Any(t => t == e.Id))
                .Select(e => ObjectMapper.Map<DisciplineTaxonomyStudyLevelDto>(e))
                .ToListAsync();

            return disciplineStudyLevels;
        }

        private IQueryable<int> GetUserDisciplineTaxonomyStudyLevelIds(long userId, Guid disciplineTaxonomyId)
        {
            return _userDisciplineTaxonomystudyLevelsRepository.GetAll()
                .Where(e => e.UserId == userId && e.DisciplineTaxonomyId == disciplineTaxonomyId)
                .Select(e => e.DisciplineTaxonomyStudyLevelId);
        }

        public async Task CreateManyDisciplineTaxonomyStudyLevel(Guid disciplineTaxonomyId, IEnumerable<int> studyLevelIds)
        {
            foreach (var levelId in studyLevelIds)
            {
                var userDisciplineStudyLevel = new UserDisciplineTaxonomyStudyLevel()
                {
                    UserId = AbpSession.UserId.Value,
                    DisciplineTaxonomyId = disciplineTaxonomyId,
                    DisciplineTaxonomyStudyLevelId = levelId
                };

                await _userDisciplineTaxonomystudyLevelsRepository.InsertAsync(userDisciplineStudyLevel);
            }
        }

        public async Task DeleteDisciplineTaxonomyStudyLevel(int id)
        {
            await _userDisciplineTaxonomystudyLevelsRepository.DeleteAsync(id);
        }
    }
}
