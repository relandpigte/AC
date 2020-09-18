using Abp.Application.Services;
using Academically.AddressLookup.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.AddressLookup
{
    public interface IAddressLookupAppService : IApplicationService
    {
        Task<IEnumerable<SuggestionDataDto>> GetAddress(string keyword);  
    }
}
