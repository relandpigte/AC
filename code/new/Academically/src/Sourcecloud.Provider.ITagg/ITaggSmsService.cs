using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using SourceCloud.Core.Configurations;
using SourceCloud.Core.Services;

namespace SourceCloud.Providers.ITagg
{
    public class ITaggSmsService : ISmsService
    {
        private const string BASE_URL = "https://secure.itagg.com/smsg/sms.mes";
        private const string ROUTE = "d";
        private readonly SmsConfiguration _configuration;

        public ITaggSmsService(
            SmsConfiguration configuration
            )
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string sender, string recipient, string message)
        {
            message = HttpUtility.UrlEncode(message);
            using (var httpClient = new HttpClient())
            {
                string url = $"{BASE_URL}?usr={_configuration.Username}&pwd={_configuration.Password}&from=Academ&to={recipient}&type=text&route={ROUTE}&txt={message}";
                using (var request = new HttpRequestMessage(new HttpMethod("POST"), url))
                {
                    var response = await httpClient.SendAsync(request);
                }
            }
        }
    }
}
