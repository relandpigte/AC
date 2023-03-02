using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using System;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class ServicesHub : AbpHubBase, ITransientDependency
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
