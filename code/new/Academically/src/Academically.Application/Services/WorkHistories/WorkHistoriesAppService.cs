using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Services.WorkHistories.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.WorkHistories
{
    public class WorkHistoriesAppService : AcademicallyAppServiceBase, IWorkHistoriesAppService
    {
        private readonly IRepository<WorkHistory, Guid> _workHistoryRepository;

        public WorkHistoriesAppService(IRepository<WorkHistory, Guid> workHistoryRepository)
        {
            _workHistoryRepository = workHistoryRepository;
        }

        public async Task<IEnumerable<WorkHistoryDto>> GetAll(long userId)
        {
            var workHistories = await _workHistoryRepository.GetAll()
                .Include(w => w.CreatorUser)
                .Where(w => w.CreatorUserId == userId)
                .OrderByDescending(w => w.EndYear).ThenByDescending(w => w.StartYear)
                .ToListAsync();

            return ObjectMapper.Map<IEnumerable<WorkHistoryDto>>(workHistories);
        }

        public async Task<WorkHistoryDto> CreateAsync(WorkHistoryDto input)
        {
            var workHistory = ObjectMapper.Map<WorkHistory>(input);
            workHistory.CreationTime = Clock.Now;
            workHistory.CreatorUserId = AbpSession.UserId.Value;
            workHistory.Id = await _workHistoryRepository.InsertAndGetIdAsync(workHistory);
            return input;
        }
       
        public async Task DeleteAsync(Guid id)
        {
            await _workHistoryRepository.DeleteAsync(id);
        }
    }
}