using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class EventSettingsHub : AbpHubBase, ITransientDependency
    {
        private const string allEventSettings = "event-settings-all";

        public override async Task OnConnectedAsync()
        {
            var referenceId = Context.GetHttpContext().Request.Query["referenceId"].FirstOrDefault();
            var userId = Context.GetHttpContext().Request.Query["userId"].FirstOrDefault();

            var groups = new ArrayList();

            if (!string.IsNullOrWhiteSpace(referenceId))
            {
                groups.Add(referenceId);

                if (!string.IsNullOrWhiteSpace(userId))
                {
                    groups.Add(userId);
                }

                var group = String.Join("-", groups.ToArray());
                await Groups.AddToGroupAsync(Context.ConnectionId, group);
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, allEventSettings);
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

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
