using Abp.Application.Services;
using System.Threading.Tasks;

namespace Academically.Services.Payments
{
    public interface IPaymentsAppService : IApplicationService
    {
        Task OnboardUser(string code);
    }
}
