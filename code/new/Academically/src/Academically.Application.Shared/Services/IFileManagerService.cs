using System.Threading.Tasks;

namespace Academically.Application.Shared.Services
{
    public interface IFileManagerService
    {
        Task<byte[]> DownloadAsync(string fileName, string? folder = null, bool isPrivate = false);
        Task UploadAsync(string fileName, byte[] fileBytes, string? folder = null, bool isPrivate = false);
        Task MoveAsync(string srcFolder, string srcFileName, string destFolder, string destFileName, bool isPrivate = false);
        Task DeleteAsync(string folder, string fileName, bool isPrivate = false);
        string GeneratePreSignedURL(string fileName, string folder);
        string GeneratePublicFileUrl(string fileName, string folder);
        string GetRootPath();
    }
}