using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface IPaymentService
    {
        Task<string> OnboardAsync(string code);
    }
}
