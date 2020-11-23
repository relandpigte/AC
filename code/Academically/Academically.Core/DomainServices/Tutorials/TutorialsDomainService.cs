using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Academically.Configuration;
using Academically.Entities;
using Microsoft.EntityFrameworkCore;

namespace Academically.DomainServices.Tutorials
{
    public class TutorialsDomainService : AcademicallyDomainServiceBase, ITutorialsDomainService
    {
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<UserTutorialDisciplineTaxonomy, Guid> _userTutorialDisciplineTaxonomiesRepository;
        private readonly IRepository<UserDisciplineTaxonomyStudyLevel, int> _userDisciplineTaxonomiesStudyLevelsRepository;
        private readonly ISettingManager _settingManager;
        private const int TOTAL_NUMBER_OF_LEVELS = 9;
        private const int LEVEL_ID_INCREMENT = 100;

        public TutorialsDomainService(
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<UserTutorialDisciplineTaxonomy, Guid> userTutorialDisciplineTaxonomiesRepository,
            IRepository<UserDisciplineTaxonomyStudyLevel, int> userDisciplineTaxonomiesStudyLevelsRepository,
            ISettingManager settingManager
            )
        {
            _userTutorialsRepository = userTutorialsRepository;
            _userProfilesRepository = userProfilesRepository;
            _userTutorialDisciplineTaxonomiesRepository = userTutorialDisciplineTaxonomiesRepository;
            _userDisciplineTaxonomiesStudyLevelsRepository = userDisciplineTaxonomiesStudyLevelsRepository;
            _settingManager = settingManager;
        }

        [UnitOfWork]
        public async Task<IEnumerable<SearchTutorDomainDto>> SearchTutors(Guid userTutorialId)
        {
            var userTutorial = await _userTutorialsRepository.GetAsync(userTutorialId);
            double aosScore = await _settingManager.GetSettingValueAsync<double>(AppSettingNames.RankingWeightings_AreaOfStudyScore);
            double aosLevelScore = await _settingManager.GetSettingValueAsync<double>(AppSettingNames.RankingWeightings_AreaOfStudyLevelScore);
            double aosLevelAndAboveScore = await _settingManager.GetSettingValueAsync<double>(AppSettingNames.RankingWeightings_AreaOfStudyLevelAndAboveScore);

            var tutorialDisciplineTaxonomiesQuery = _userTutorialDisciplineTaxonomiesRepository.GetAll()
                .Where(e => e.TutorialId == userTutorialId);

            var userProfiles = await _userProfilesRepository
                .GetAll()
                .Include(e => e.User)
                    .ThenInclude(e => e.UserDisciplineTaxonomies)
                .Where(x => x.User.UserDisciplineTaxonomies.Any(y => tutorialDisciplineTaxonomiesQuery.Any(z => z.DisciplineTaxonomyId == y.DisciplineTaxonomyId)))
                .Take(20)
                .ToListAsync();

            var tutorialDisciplineTaxonomies = await tutorialDisciplineTaxonomiesQuery.ToListAsync();

            var results = new List<SearchTutorDomainDto>();
            foreach (var userProfile in userProfiles)
            {
                double totalScore = 0;
                foreach (var taxonomy in tutorialDisciplineTaxonomies)
                {
                    double score = 0;
                    var userTaxonomy = userProfile.User.UserDisciplineTaxonomies.FirstOrDefault(e => e.DisciplineTaxonomyId == taxonomy.DisciplineTaxonomyId);
                    if (userTaxonomy != null)
                    {
                        score = aosScore;
                        var userTaxonomyLevel = await _userDisciplineTaxonomiesStudyLevelsRepository
                            .FirstOrDefaultAsync(e => e.UserId == userProfile.UserId && e.DisciplineTaxonomyId == userTaxonomy.DisciplineTaxonomyId);
                        if (userTaxonomyLevel != null)
                        {
                            if (userTutorial.SupportLevel >= userTaxonomyLevel.DisciplineTaxonomyStudyLevelId)
                            {
                                score = score * aosLevelScore;
                            }

                            var allUserTaxonomyLevels = await _userDisciplineTaxonomiesStudyLevelsRepository
                                .GetAll()
                                .OrderBy(e => e.DisciplineTaxonomyStudyLevelId)
                                .Where(e => e.UserId == userProfile.UserId && e.DisciplineTaxonomyId == userTaxonomy.DisciplineTaxonomyId)
                                .ToListAsync();

                            var countDifference = TOTAL_NUMBER_OF_LEVELS - allUserTaxonomyLevels.Count;
                            var lowestLevel = (allUserTaxonomyLevels.FirstOrDefault().DisciplineTaxonomyStudyLevelId - LEVEL_ID_INCREMENT);
                            if (countDifference == lowestLevel)
                            {
                                score = score * aosLevelAndAboveScore;
                            }
                        }
                    }
                    totalScore += score;
                }
                results.Add(new SearchTutorDomainDto()
                {
                    User = userProfile.User,
                    Score = totalScore,
                });
            }

            return results.OrderByDescending(e => e.Score);
        }
    }
}
