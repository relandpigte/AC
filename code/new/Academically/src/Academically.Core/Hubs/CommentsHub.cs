using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class CommentsHub : AbpHubBase, ITransientDependency
    {
        public override async Task OnConnectedAsync()
        {
            var referenceId = Context.GetHttpContext().Request.Query["referenceId"].FirstOrDefault();
            var parentId = Context.GetHttpContext().Request.Query["parentId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(referenceId) && !string.IsNullOrWhiteSpace(parentId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"{referenceId}-{parentId}");
            }

            if (!string.IsNullOrWhiteSpace(referenceId) && string.IsNullOrWhiteSpace(parentId))
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
