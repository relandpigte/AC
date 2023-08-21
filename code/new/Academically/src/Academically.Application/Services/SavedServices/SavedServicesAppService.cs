using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Reactions.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.SavedServices
{
	public class SavedServicesAppService : AcademicallyAppServiceBase, ISavedServicesAppService
	{
        private readonly IRepository<SavedService, Guid> _savedServiceRepository;

        public SavedServicesAppService(
            IRepository<SavedService, Guid> savedServiceRepository
        )
		{
            _savedServiceRepository = savedServiceRepository;
        }

        public async Task SaveAsync(Guid referenceId)
        {
            var newSavedService = new SavedService();
            newSavedService.ReferenceId = referenceId;
            newSavedService.CreatorUserId = AbpSession.UserId.Value;
            newSavedService.CreationTime = Clock.Now;

            await this._savedServiceRepository.InsertAsync(newSavedService);
        }

        public async Task DeleteAsync(Guid referenceId)
        {
            var existing = await this._savedServiceRepository.GetAll()
                    .Where(s => s.ReferenceId == referenceId)
                    .Where(s => s.CreatorUserId == AbpSession.UserId.Value)
                    .SingleOrDefaultAsync();
            if (existing != null)
            {
                await this._savedServiceRepository.DeleteAsync(existing.Id);
            }
        }
    }
}

