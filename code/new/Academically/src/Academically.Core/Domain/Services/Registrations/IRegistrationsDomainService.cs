using System.Threading.Tasks;
using Abp.Domain.Services;
using Academically.Domain.Entities;

namespace Academically.Domain.Services.Registrations
{
    public interface IRegistrationsDomainService : IDomainService
    {
        Task InsertAsync(Registration registration);
    }
}
