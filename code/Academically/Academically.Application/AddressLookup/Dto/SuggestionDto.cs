using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.AddressLookup.Dto
{
    public class SuggestionDto
    {
        public IEnumerable<SuggestionDataDto> Suggestions { get; set; }
    }
}
