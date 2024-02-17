using System.Threading.Tasks;

namespace Academically.Application.Shared.Services
{
    public interface IPaymentService
    {
        Task<string> OnboardAsync(string code);
    }
}
