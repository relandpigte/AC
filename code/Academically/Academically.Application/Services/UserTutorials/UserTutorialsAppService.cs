using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.UserTutorials.Dto;
using Amazon.Runtime.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.UserTutorials
{
    public class UserTutorialsAppService : AcademicallyAppServiceBase, IUserTutorialsAppService
    {
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<UserTutorialDisciplineTaxonomy, Guid> _userTutorialsDisciplineTaxonomiesRepository;
        private readonly IRepository<SupportLevel, int> _supportLevelRepository;

        public UserTutorialsAppService
        (
            IRepository<UserTutorial, Guid> userTutorialsRepository, 
            IRepository<UserTutorialDisciplineTaxonomy, Guid> userTutorialsDisciplineTaxonomiesRepository,
            IRepository<SupportLevel, int> supportLevelRepository
        )
        {
            _userTutorialsRepository = userTutorialsRepository;
            _userTutorialsDisciplineTaxonomiesRepository = userTutorialsDisciplineTaxonomiesRepository;
            _supportLevelRepository = supportLevelRepository;
        }


        public async Task CreateAsync(UserTutorialDto inputs)
        {
           var userTutorial = ObjectMapper.Map<UserTutorial>(inputs);
           await _userTutorialsRepository.InsertAsync(userTutorial);

            if (userTutorial.Id != null && inputs.DisciplineTaxonomyIds.Count() > 0)
            {
                foreach (var disciplineTaxonomyId in inputs.DisciplineTaxonomyIds)
                {
                    var userTutorialDisciplineTaxonomy = new UserTutorialDisciplineTaxonomy()
                    {
                        TutorialId = userTutorial.Id,
                        DisciplineTaxonomyId = disciplineTaxonomyId
                    };
                    await _userTutorialsDisciplineTaxonomiesRepository.InsertAsync(userTutorialDisciplineTaxonomy);
                }
            }
        }

        public async Task<IEnumerable<SupportLevelDto>> GetSupportLevelsAsync()
        {
            var supportLevels = await _supportLevelRepository.GetAll()
                .Select(e => ObjectMapper.Map<SupportLevelDto>(e))
                .ToListAsync();

            return supportLevels;
        }
    }
}
