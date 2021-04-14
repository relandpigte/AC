using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface IFileManagerService
    {
        Task<byte[]> DownloadAsync(string folder, string fileName);
        Task UploadAsync(string fileName, string type, byte[] fileBytes, string folder = null, bool isSecured = false);
        Task DeleteAsync(string folder, string fileName, bool isSecured = false);
        string GetDirectoryUrl();
        string GetFileUrl(string fileName, string folder = null, bool isSecured = false);
    }
}
