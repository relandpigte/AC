using Academically.Services.PhotoIdVerifications.Dto;
using System.Threading.Tasks;

namespace Academically.Services.PhotoIdVerifications
{
    public interface IPhotoIdVerificationsAppService
    {
        Task<PhotoIdVerificationDto> GetLatest(long userId);
        Task Create(CreatePhotoIdVerificationDto input);
    }
}
