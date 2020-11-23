using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Domain.Services;

namespace Academically.DomainServices.Tutorials
{
    public interface ITutorialsDomainService : IDomainService
    {
        Task<IEnumerable<SearchTutorDomainDto>> SearchTutors(Guid userTutorialId);
    }
}
