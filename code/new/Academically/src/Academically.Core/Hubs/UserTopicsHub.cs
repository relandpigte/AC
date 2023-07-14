using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Academically.Authorization.Users;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class UserTopicsHub : AbpHubBase, ITransientDependency
    {
        private const string UserTopicsGroup = "user-topics-group";

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext().Request.Query["userId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, UserTopicsGroup);
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
