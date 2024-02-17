using System.Threading.Tasks;

namespace Academically.Application.Shared.Services
{
    public interface ISmsService
    {
        Task SendAsync(string sender, string recipient, string message);
    }
}
