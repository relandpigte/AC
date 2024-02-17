using Academically.Application.Shared.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Application.Shared.Services
{
    public interface ILocationsService
    {
        Task<IEnumerable<LocationSuggestion>> GetSuggestions(string keyword);
        Task<LocationDetail> Get(string id);
    }
}
