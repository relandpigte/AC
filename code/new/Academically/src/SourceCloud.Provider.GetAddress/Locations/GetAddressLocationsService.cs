using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using SourceCloud.Core.Services.Locations;

namespace SourceCloud.Provider.GetAddress.Locations
{
    public class GetAddressLocationsService : ILocationsService
    {
        private const string BASE_URL = "https://api.getAddress.io";
        private readonly GetAddressLocationsOptions _configuration;

        public GetAddressLocationsService(
            GetAddressLocationsOptions configuration
            )
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<LocationSuggestion>> GetSuggestions(string keyword)
        {
            var suggestionsUrl = $"autocomplete/{keyword}?api-key={_configuration.ApiKey}";
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(BASE_URL);

                HttpResponseMessage response = await httpClient.GetAsync(suggestionsUrl);
                response.EnsureSuccessStatusCode();
                var stringResponse = await response.Content.ReadAsStringAsync();
                var autocompleteResponse = JsonConvert.DeserializeObject<GetAddressAutocompleteResponse>(stringResponse);
                return autocompleteResponse.Suggestions;
            }
        }

        public async Task<LocationDetail> Get(string id)
        {
            var locationUrl = $"get/{id}?api-key={_configuration.ApiKey}";
            using (var httpClient = new HttpClient())
            {
                httpClient.BaseAddress = new Uri(BASE_URL);

                HttpResponseMessage response = await httpClient.GetAsync(locationUrl);
                response.EnsureSuccessStatusCode();
                var stringResponse = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<LocationDetail>(stringResponse);
            }
        }
    }
}
