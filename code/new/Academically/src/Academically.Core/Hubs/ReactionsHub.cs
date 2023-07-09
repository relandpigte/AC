using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class ReactionsHub : AbpHubBase, ITransientDependency
    {
        private const string ReactionsGroup = "reactions-group";
        public override async Task OnConnectedAsync()
        {
            var referenceId = Context.GetHttpContext().Request.Query["referenceId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(referenceId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, referenceId);
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, ReactionsGroup);
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
