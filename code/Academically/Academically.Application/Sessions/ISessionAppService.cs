using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Sessions.Dto;

namespace Academically.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
