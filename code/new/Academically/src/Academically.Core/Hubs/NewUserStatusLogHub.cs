using System.Linq;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;

namespace Academically.Hubs;

public class NewUserStatusLogHub : AbpHubBase, ITransientDependency
{
    private const string AllUserStatusLogs = "user-status-logs";
    
    
    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"].FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}" );
        }
        else
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, AllUserStatusLogs);
        }

        await base.OnConnectedAsync();
    }
}