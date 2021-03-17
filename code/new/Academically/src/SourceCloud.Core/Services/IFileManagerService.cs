using System.Threading.Tasks;

namespace SourceCloud.Core.Services
{
    public interface IFileManagerService
    {
        Task<byte[]> DownloadAsync(string folder, string fileName);
        Task UploadAsync(string fileName, byte[] fileBytes, string folder = null);
        Task DeleteAsync(string folder, string fileName);
        string GetDirectoryUrl();
        string GetFileUrl(string fileName, long userId, string folderSetting = null);
    }
}
