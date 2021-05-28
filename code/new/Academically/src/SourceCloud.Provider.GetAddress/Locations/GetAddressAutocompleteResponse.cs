using System.Collections.Generic;
using SourceCloud.Core.Services.Locations;

namespace SourceCloud.Provider.GetAddress.Locations
{
    public class GetAddressAutocompleteResponse
    {
        public IEnumerable<LocationSuggestion> Suggestions { get; set; }
    }
}
