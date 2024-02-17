using System.Collections.Generic;

namespace Academically.Application.Shared.Dto
{
    public class GetAddressAutocompleteResponse
    {
        public IEnumerable<LocationSuggestion> Suggestions { get; set; }
    }
}
