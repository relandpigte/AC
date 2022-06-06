using Abp.Application.Services;
using Academically.Services.WorkHistories.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.WorkHistories
{
    public interface IWorkHistoriesAppService : IApplicationService
    {
        Task<IEnumerable<WorkHistoryDto>> GetAll(long userId);
        Task<WorkHistoryDto> CreateAsync(WorkHistoryDto input);
        Task DeleteAsync(Guid id);
    }
}