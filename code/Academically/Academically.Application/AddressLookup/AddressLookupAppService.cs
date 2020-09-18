using Abp.Configuration;
using Academically.AddressLookup.Dto;
using Academically.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace Academically.AddressLookup
{
    public class AddressLookupAppService : IAddressLookupAppService
    {
        private string SuggestUrl;
        private string ApiKey;
        private string GetDetailsUrl;
        private string UrlParameters;
        public AddressLookupAppService(ISettingManager settingManager) 
        {
            SuggestUrl = settingManager.GetSettingValue(AppSettingNames.Address_SuggestUrl);
            ApiKey = settingManager.GetSettingValue(AppSettingNames.Address_ApiKey);
            GetDetailsUrl = settingManager.GetSettingValue(AppSettingNames.Address_GetDetailsUrl);
            UrlParameters = settingManager.GetSettingValue(AppSettingNames.Address_UrlParameters);
        }

        public async Task<IEnumerable<SuggestionDataDto>> GetAddress(string keyword)
        {
            var result = new SuggestionDto();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(SuggestUrl + keyword);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync(UrlParameters + ApiKey);
                response.EnsureSuccessStatusCode();
                var responseAsString = await response.Content.ReadAsStringAsync();
                result = JsonConvert.DeserializeObject<SuggestionDto>(responseAsString);
            }

            return result.Suggestions;
        }

        public async Task<AddressDetailDto> GetAddressDetail(string id)
        {
            var result = new AddressDetailDto();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(GetDetailsUrl + id);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync(UrlParameters + ApiKey);
                response.EnsureSuccessStatusCode();
                var responseAsString = await response.Content.ReadAsStringAsync();
                result = JsonConvert.DeserializeObject<AddressDetailDto>(responseAsString);
            }

            return result;
        }
    }
}
