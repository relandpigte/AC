using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface ISmsService
    {
        Task SendAsync(string sender, string recipient, string message);
    }
}
