using Abp.Application.Services;
using Academically.Services.AuditLogs.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.AuditLogs
{
    public interface IAuditLogsAppService : IApplicationService
    {
        Task<IEnumerable<AuditLogsDto>> Get();
    }
}
