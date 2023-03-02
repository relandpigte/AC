using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class PostsHub : AbpHubBase, ITransientDependency
    {
        private const string FollowingGroup = "following-group";

        public override async Task OnConnectedAsync()
        {
            var postId = Context.GetHttpContext().Request.Query["postId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(postId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, postId);
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, FollowingGroup);
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
