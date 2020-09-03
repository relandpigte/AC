using Microsoft.Extensions.Configuration;

namespace Academically.Configuration
{
    public interface IAppConfigurationAccessor
    {
        IConfigurationRoot Configuration { get; }
    }
}
