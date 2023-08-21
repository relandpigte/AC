using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Reactions.Dto;

namespace Academically.Services.SavedServices
{
	public interface ISavedServicesAppService : IApplicationService
	{
		Task SaveAsync(Guid referenceId);
        Task DeleteAsync(Guid referenceId);
    }
}

