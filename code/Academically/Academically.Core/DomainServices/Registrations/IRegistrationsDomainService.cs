using System;
using System.Threading.Tasks;
using Abp.Domain.Services;
using Academically.Entities;

namespace Academically.DomainServices.Registrations
{
    public interface IRegistrationsDomainService : IDomainService
    {
        Task<Registration> GetAsync(Guid id);
        Task InsertAsync(Registration registration);
    }
}
