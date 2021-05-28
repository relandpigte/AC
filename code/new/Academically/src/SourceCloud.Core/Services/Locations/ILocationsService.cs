using System.Collections.Generic;
using System.Threading.Tasks;

namespace SourceCloud.Core.Services.Locations
{
    public interface ILocationsService
    {
        Task<IEnumerable<LocationSuggestion>> GetSuggestions(string keyword);
        Task<LocationDetail> Get(string id);
    }
}
