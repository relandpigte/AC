using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.AcceptanceLogs.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.AcceptanceLogs
{
    public interface IAcceptanceLogsAppService : IApplicationService
    {
        Task Accept(AcceptanceType type);
        Task<AcceptanceLogDto> GetLatest(AcceptanceType type);
    }
}
