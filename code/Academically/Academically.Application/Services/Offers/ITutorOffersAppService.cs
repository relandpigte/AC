using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Offers.Dto;

namespace Academically.Services.Offers
{
    public interface ITutorOffersAppService : IApplicationService
    {
        Task<GetTutorOfferDto> GetAsync(Guid offerId);
        Task CreateAsync(CreateTutorOfferDto inputs);
        Task<bool> AcceptOfferAsync(Guid offerId, bool isAccepted);
        Task<GetTutorOfferDto> GetOfferAsync(Guid tutorialId);
        Task<IEnumerable<GetTutorOfferDto>> GetAllAsync(Guid tutorialId);
        Task<int> GetTutorHighestEducationLevel(long userId);
    }
}
