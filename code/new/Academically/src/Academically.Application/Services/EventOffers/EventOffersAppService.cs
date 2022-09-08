

using Abp.Application.Services;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.EventOffers.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.EventOffers
{
    public class EventOffersAppService : AsyncCrudAppService<EventOffer, EventOfferDto, Guid, PagedEventOfferResultRequestDto, CreateEventOfferDto>, IEventOffersAppService
    {
        public EventOffersAppService(IRepository<EventOffer, Guid> repository) : base(repository)
        {
        }

        public async Task<IEnumerable<EventOfferDto>> GetAllUnpagedAsync(Guid eventId)
        {
            return await Repository.GetAll()
                .Where(e => e.EventId == eventId)
                .Select(e => ObjectMapper.Map<EventOfferDto>(e))
                .ToListAsync();
        }
    }
}
