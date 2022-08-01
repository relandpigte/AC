using Abp.Application.Services;
using Academically.Services.EventOffers.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.EventOffers
{
    public interface IEventOffersAppService : IAsyncCrudAppService<EventOfferDto, Guid, PagedEventOfferResultRequestDto, CreateEventOfferDto>
    {
        Task<IEnumerable<EventOfferDto>> GetAllUnpagedAsync(Guid eventId);
    }
}
