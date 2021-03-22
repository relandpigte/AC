using Abp.Application.Services;
using Academically.Services.UserQualifications.Dto;
using System.Threading.Tasks;

namespace Academically.Services.UserQualifications
{
    public interface IUserQualificationsAppService : IApplicationService
    {
        Task<UserQualificationDto> GetAll();
        Task Create(CreateUserQualificationDto input);
    }
}
