using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;

namespace Academically.Hubs;

public class NotificationsHub : AbpHubBase, ITransientDependency
{
    private const string AllNotifications = "notif-all";
    
    
    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"].FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"notif-{userId}" );
        }
        else
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, AllNotifications);
        }

        await base.OnConnectedAsync();
    }
}