using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Currencies.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Currencies
{
    public class CurrenciesAppService : AcademicallyAppServiceBase, ICurrenciesAppService
    {
        private readonly IRepository<Currency, Guid> _currenciesRepository;

        public CurrenciesAppService(
            IRepository<Currency, Guid> currenciesRepository
            )
        {
            _currenciesRepository = currenciesRepository;
        }

        public async Task<IEnumerable<CurrencyDto>> GetAll()
        {
            return await _currenciesRepository.GetAll()
                .OrderBy(e => e.Code)
                .Select(e => ObjectMapper.Map<CurrencyDto>(e))
                .ToListAsync();
        }
    }
}
