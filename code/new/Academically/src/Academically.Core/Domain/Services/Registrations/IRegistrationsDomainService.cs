using Abp.Domain.Services;
using Academically.Domain.Entities;
using System;
using System.Threading.Tasks;

namespace Academically.Domain.Services.Registrations
{
    public interface IRegistrationsDomainService : IDomainService
    {
        Task<Registration> GetAsync(Guid id);
        Task InsertAsync(Registration registration);
    }
}
