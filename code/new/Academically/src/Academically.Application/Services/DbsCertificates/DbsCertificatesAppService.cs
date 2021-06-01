using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.DbsCertificates.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.DbsCertificates
{
    [AbpAuthorize(PermissionNames.Pages_TutorWizard_DbsCheck)]
    public class DbsCertificatesAppService : AsyncCrudAppService<DbsCertificate, DbsCertificateDto, Guid, PagedAndSortedResultRequestDto, CreateDbsCertificateDto, UpdateDbsCertificateDto>, IDbsCertificatesAppService
    {
        private readonly IDocumentsDomainService _documentsDomainService;

        public DbsCertificatesAppService(
            IRepository<DbsCertificate, Guid> repository,
            IDocumentsDomainService documentsDomainService
            ) : base(repository)
        {
            CreatePermissionName = PermissionNames.Pages_TutorWizard_DbsCheck_Create;
            UpdatePermissionName = PermissionNames.Pages_TutorWizard_DbsCheck_Update;
            DeletePermissionName = PermissionNames.Pages_TutorWizard_DbsCheck_Delete;

            _documentsDomainService = documentsDomainService;
        }

        protected override IQueryable<DbsCertificate> CreateFilteredQuery(PagedAndSortedResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Include(e => e.Document)
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value);
        }

        public override async Task<PagedResultDto<DbsCertificateDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var output = await base.GetAllAsync(input);
            foreach (var item in output.Items)
            {
                item.DbsCertificateFileUrl = await _documentsDomainService.GetFileUrlAsync(item.DocumentId);
            }
            return output;
        }

        public override async Task<DbsCertificateDto> CreateAsync([FromForm] CreateDbsCertificateDto input)
        {
            var dbsCertificateDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.DbsCertificate);
            var dbsCertificate = ObjectMapper.Map<DbsCertificate>(input);
            dbsCertificate.DocumentId = dbsCertificateDocument.Id;
            await Repository.InsertAsync(dbsCertificate);
            return ObjectMapper.Map<DbsCertificateDto>(dbsCertificate);
        }

        public override async Task<DbsCertificateDto> UpdateAsync([FromForm] UpdateDbsCertificateDto input)
        {
            var dbsCertificate = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, dbsCertificate);
            if (input.File != null)
            {
                await _documentsDomainService.DeleteAsync(dbsCertificate.DocumentId);
                var dbsCertificateDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.DbsCertificate);
                dbsCertificate.DocumentId = dbsCertificateDocument.Id;
                await Repository.UpdateAsync(dbsCertificate);
            }
            return ObjectMapper.Map<DbsCertificateDto>(dbsCertificate);
        }

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            var dbsCertificate = await Repository.GetAsync(input.Id);
            await _documentsDomainService.DeleteAsync(dbsCertificate.DocumentId);
            await base.DeleteAsync(input);
        }
    }
}
