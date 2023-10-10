using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Hubs
{
    public class QuestionsReactionsHub : AbpHubBase, ITransientDependency
    {
        private const string QuestionsReactionsGroup = "questions-reactions-group";
        
        public override async Task OnConnectedAsync()
        {
            var referenceId = Context.GetHttpContext()?.Request.Query["referenceId"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(referenceId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, referenceId);
            }
            else
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, QuestionsReactionsGroup);
            }
        }
    }
}