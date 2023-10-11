using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class ServiceOffersHub : AbpHubBase, ITransientDependency
    {
        public override async Task OnConnectedAsync()
        {
            var referenceId = Context.GetHttpContext().Request.Query["referenceId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(referenceId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, referenceId);
            }

            await base.OnConnectedAsync();
            return;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
