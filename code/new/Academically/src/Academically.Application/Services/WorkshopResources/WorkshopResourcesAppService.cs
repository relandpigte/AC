using System;
using System.Linq;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.WorkshopResources.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.WorkshopResources
{
    public class WorkshopResourcesAppService : AsyncCrudAppService<WorkshopResource, WorkshopResourceDto, Guid, PagedWorkshopResourceResultRequestDto, CreateWorkshopResourceDto>, IWorkshopResourcesAppService
    {
        public WorkshopResourcesAppService(IRepository<WorkshopResource, Guid> repository) : base(repository)
        {
        }

        protected override IQueryable<WorkshopResource> CreateFilteredQuery(PagedWorkshopResourceResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.WorkshopId == input.WorkshopIdFilter)
                .WhereIf(input.PresentationMaterialsOnlyFilter, e => e.Type == WorkshopResourceType.Slides || e.Type == WorkshopResourceType.Video)
                .WhereIf(input.HandoutsOnlyFilter, e => e.Type == WorkshopResourceType.Handout);
        }

        protected override IQueryable<WorkshopResource> ApplyPaging(IQueryable<WorkshopResource> query, PagedWorkshopResourceResultRequestDto input)
        {
            return base.ApplyPaging(query, input)
                .Include(e => e.Document);
        }
    }
}

