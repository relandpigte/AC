using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Castle.Core.Resource;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class ServiceHandoutsHub : AbpHubBase, ITransientDependency
    {
        public override async Task OnConnectedAsync()
        {
            var referenceId = Context.GetHttpContext().Request.Query["referenceId"].FirstOrDefault();
            var userId = Context.GetHttpContext().Request.Query["userId"].FirstOrDefault();

            var possibleGroups = (new string[] { referenceId, userId }).Where(x => !string.IsNullOrEmpty(x)).ToArray();
            var group = String.Join("-", possibleGroups);

            if (!string.IsNullOrWhiteSpace(group))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, group);
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
