using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.ProjectOffers.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.ProjectOffers
{
    public class ProjectOffersAppService : AcademicallyAppServiceBase, IProjectOffersAppService
    {
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;

        public ProjectOffersAppService(
            IRepository<ProjectOffer, Guid> projectOffersRepository
            )
        {
            _projectOffersRepository = projectOffersRepository;
        }

        public async Task CreateAsync(CreateProjectOfferDto input)
        {
            var projectOffer = ObjectMapper.Map<ProjectOffer>(input);
            await _projectOffersRepository.InsertAsync(projectOffer);
        }
    }
}
