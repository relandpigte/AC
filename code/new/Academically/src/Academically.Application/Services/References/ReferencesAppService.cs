using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.References.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.References
{
    [AbpAuthorize(PermissionNames.Pages_TutorWizard_References)]
    public class ReferencesAppService : AsyncCrudAppService<Reference, ReferenceDto, Guid, PagedReferenceResultRequestDto, CreateReferenceDto, UpdateReferenceDto>, IReferencesAppService
    {
        private readonly IDocumentsDomainService _documentsDomainService;

        public ReferencesAppService(
            IRepository<Reference, Guid> repository,
            IDocumentsDomainService documentsDomainService
            ) : base(repository)
        {
            CreatePermissionName = PermissionNames.Pages_TutorWizard_References_Create;
            UpdatePermissionName = PermissionNames.Pages_TutorWizard_References_Update;
            DeletePermissionName = PermissionNames.Pages_TutorWizard_References_Delete;

            _documentsDomainService = documentsDomainService;
        }

        protected override IQueryable<Reference> CreateFilteredQuery(PagedReferenceResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Include(e => e.Document)
                .Where(e => e.CreatorUserId == input.UserIdFilter);
        }

        public override async Task<PagedResultDto<ReferenceDto>> GetAllAsync(PagedReferenceResultRequestDto input)
        {
            var output = await base.GetAllAsync(input);
            foreach (var item in output.Items)
            {
                item.ReferenceFileUrl = await _documentsDomainService.GetFileUrlAsync(item.DocumentId);
            }
            return output;
        }

        public override async Task<ReferenceDto> CreateAsync([FromForm] CreateReferenceDto input)
        {
            var referenceDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.Reference);
            var reference = ObjectMapper.Map<Reference>(input);
            reference.DocumentId = referenceDocument.Id;
            await Repository.InsertAsync(reference);
            return ObjectMapper.Map<ReferenceDto>(reference);
        }

        public override async Task<ReferenceDto> UpdateAsync([FromForm] UpdateReferenceDto input)
        {
            var reference = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, reference);
            if (input.File != null)
            {
                await _documentsDomainService.DeleteAsync(reference.DocumentId);
                var referenceDocment = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.Reference);
                reference.DocumentId = referenceDocment.Id;
                await Repository.UpdateAsync(reference);
            }
            return ObjectMapper.Map<ReferenceDto>(reference);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            var reference = await Repository.GetAsync(input.Id);
            await _documentsDomainService.DeleteAsync(reference.DocumentId);
            await base.DeleteAsync(input);
        }
    }
}
