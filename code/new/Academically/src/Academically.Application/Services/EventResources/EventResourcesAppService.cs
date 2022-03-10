using System;
using System.Linq;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.EventResources.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.EventResources
{
    public class EventResourcesAppService : AsyncCrudAppService<EventResource, EventResourceDto, Guid, PagedEventResourceResultRequestDto, CreateEventResourceDto>, IEventResourcesAppService
    {
        public EventResourcesAppService(IRepository<EventResource, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<EventResource> CreateFilteredQuery(PagedEventResourceResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.EventId == input.EventIdFilter)
                .WhereIf(input.PresentationMaterialsOnlyFilter, e => e.Type == EventResourceType.Slides || e.Type == EventResourceType.Video)
                .WhereIf(input.HandoutsOnlyFilter, e => e.Type == EventResourceType.Handout);
        }

        protected override IQueryable<EventResource> ApplyPaging(IQueryable<EventResource> query, PagedEventResourceResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.Document);
        }
    }
}

