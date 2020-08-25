using Abp.AspNetCore.Dependency;
using Abp.Dependency;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace Academically.Web.Host.Startup
{
    public class LambdaEntryPoint :
		Amazon.Lambda.AspNetCoreServer.APIGatewayProxyFunction
	{
		protected override void Init(IWebHostBuilder builder)
		{
			builder
				.UseStartup<Startup>();
		}

		protected override void Init(IHostBuilder builder)
		{
			builder
				.UseCastleWindsor(IocManager.Instance.IocContainer);
		}
	}
}
