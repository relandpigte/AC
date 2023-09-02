using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class ChannelsHub : AbpHubBase, ITransientDependency
    {
        private const string allChannels = "ch-all";

        public override async Task OnConnectedAsync()
        {
            var channelId = Context.GetHttpContext().Request.Query["channelId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(channelId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"ch-{channelId}" );
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, allChannels);
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
