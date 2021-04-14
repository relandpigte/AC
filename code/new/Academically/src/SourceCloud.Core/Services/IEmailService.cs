using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface IEmailService
    {
        Task SendAsync(string toName, string toEmail, string subject, string body);
    }
}
