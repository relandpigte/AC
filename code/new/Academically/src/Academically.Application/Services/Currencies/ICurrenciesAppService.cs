using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Currencies.Dto;

namespace Academically.Services.Currencies
{
    public interface ICurrenciesAppService : IApplicationService
    {
        Task<IEnumerable<CurrencyDto>> GetAll();
    }
}
