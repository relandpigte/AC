using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.DbsCertificates.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.DbsCertificates
{
    public interface IDbsCertificatesAppService : IAsyncCrudAppService<DbsCertificateDto, Guid, PagedDbsResultDto, CreateDbsCertificateDto, UpdateDbsCertificateDto>
    {
    }
}
