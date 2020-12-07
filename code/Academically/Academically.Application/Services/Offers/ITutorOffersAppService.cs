using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.Offers.Dto;

namespace Academically.Services.Offers
{
    public interface ITutorOffersAppService : IApplicationService
    {
        Task<GetTutorOfferDto> GetAsync(Guid offerId);
        Task CreateAsync(CreateTutorOfferDto inputs);
        Task<bool> AcceptOfferAsync(Guid offerId, bool isAccepted);
        Task<GetTutorOfferDto> GetOfferAsync(Guid tutorialId);
        Task<PagedResultDto<GetTutorOfferDto>> GetAllAsync(PagedAndSortedTutorOfferResultRequestDto input);
        Task<int> GetTutorHighestEducationLevel(long userId);
    }
}
