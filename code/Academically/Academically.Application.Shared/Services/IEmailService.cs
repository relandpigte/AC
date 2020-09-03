using System.Threading.Tasks;

namespace Academically.Application.Shared.Services
{
    public interface IEmailService
    {
        Task SendAsync(string toName, string toEmail, string subject, string body);
    }
}
