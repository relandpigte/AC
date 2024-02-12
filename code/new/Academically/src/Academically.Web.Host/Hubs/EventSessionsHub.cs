using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;

namespace Academically.Web.Host.Hubs
{
    public class EventSessionsHub : AbpHubBase, ITransientDependency
    {
        private const string EventsSessionsGroup = "event-sessions-group";

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext().Request.Query["userId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, EventsSessionsGroup);
            }

            await base.OnConnectedAsync();
            return;
        }

        public async Task SendSignal(IEnumerable<string> groups, string data)
        {
            foreach (var group in groups)
            {
                await Clients.Group(group).SendAsync("receiveSignal", data);
            }
        }
    }
}

