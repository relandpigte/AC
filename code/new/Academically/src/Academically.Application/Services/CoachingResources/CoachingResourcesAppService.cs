using System;
using System.Linq;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.CoachingResources.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CoachingResources
{
    public class CoachingResourcesAppService : AsyncCrudAppService<CoachingResource, CoachingResourceDto, Guid, PagedCoachingResourceResultRequestDto, CreateCoachingResourceDto>, ICoachingResourcesAppService
    {
        public CoachingResourcesAppService(IRepository<CoachingResource, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<CoachingResource> CreateFilteredQuery(PagedCoachingResourceResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.CoachingId == input.CoachingIdFilter)
                .WhereIf(input.PresentationMaterialsOnlyFilter, e => e.Type == CoachingResourceType.Slides || e.Type == CoachingResourceType.Video)
                .WhereIf(input.HandoutsOnlyFilter, e => e.Type == CoachingResourceType.Handout);
        }

        protected override IQueryable<CoachingResource> ApplyPaging(IQueryable<CoachingResource> query, PagedCoachingResourceResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.Document);
        }
    }
}

