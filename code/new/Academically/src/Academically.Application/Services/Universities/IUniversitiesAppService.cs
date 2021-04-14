using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Universities.Dto;

namespace Academically.Services.Universities
{
    public interface IUniversitiesAppService : IApplicationService
    {
        Task<IEnumerable<UniversityDto>> Search(string countryCode, string query);
    }
}
