using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using System;

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
    }
}
