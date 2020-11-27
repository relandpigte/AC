using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Offers.Dto;

namespace Academically.Services.Offers
{
    public interface ITutorOffersAppService : IApplicationService
    {
        Task CreateAsync(CreateTutorOfferDto inputs);
        Task<GetTutorOfferDto> GetAsync(Guid tutorialId);
        Task<IEnumerable<GetTutorOfferDto>> GetAllAsync(Guid tutorialId);
    }
}
