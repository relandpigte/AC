using Abp.Auditing;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.AcceptanceLogs.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.AcceptanceLogs
{
    public class AcceptanceLogsAppService : AcademicallyAppServiceBase, IAcceptanceLogsAppService
    {
        private readonly IRepository<AcceptanceLog, Guid> _acceptanceLogsRepository;
        private readonly IClientInfoProvider _clientInfoProvider;

        public AcceptanceLogsAppService(
            IRepository<AcceptanceLog, Guid> acceptanceLogsRepository,
            IClientInfoProvider clientInfoProvider
            )
        {
            _acceptanceLogsRepository = acceptanceLogsRepository;
            _clientInfoProvider = clientInfoProvider;
        }

        public async Task Accept(AcceptanceType type)
        {
            var acceptanceLog = new AcceptanceLog()
            {
                Type = type,
                IpAddress = _clientInfoProvider.ClientIpAddress,
            };
            await _acceptanceLogsRepository.InsertAsync(acceptanceLog);
        }

        public async Task<AcceptanceLogDto> GetLatest(AcceptanceType type)
        {
            var acceptanceLog = await _acceptanceLogsRepository.GetAll()
                .Where(e => e.Type == type && e.CreatorUserId == AbpSession.UserId.Value)
                .OrderByDescending(e => e.CreationTime)
                .Select(e => ObjectMapper.Map<AcceptanceLogDto>(e))
                .FirstOrDefaultAsync();
            return acceptanceLog;
        }

    }
}
