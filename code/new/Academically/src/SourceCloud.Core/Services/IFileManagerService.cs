using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface IFileManagerService
    {
        Task<byte[]> DownloadAsync(string folder, string fileName);
        Task UploadAsync(string fileName, string type, byte[] fileBytes, string folder = null, bool isSecured = false);
        Task DeleteAsync(string folder, string fileName);
        string GetDirectoryUrl();
        string GetFileUrl(string fileName, long userId, string folderSetting = null);
    }
}
