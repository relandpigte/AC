using Abp.Application.Services;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Documents
{
    public interface IDocumentsAppService : IApplicationService
    {
        Task<string> GetSecuredUrl(Guid id);
    }
}
