using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Registrations.Dto;

namespace Academically.Services.Registrations
{
    public interface IRegistrationsAppService : IApplicationService
    {
        Task Create(RegistrationDto input);
    }
}
