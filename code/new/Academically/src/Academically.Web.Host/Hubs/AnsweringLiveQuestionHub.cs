using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Academically.Domain.Enums;
using Academically.Services.Questions.Dto;
using Microsoft.AspNetCore.SignalR;


namespace Academically.Web.Host.Hubs 
{
    public class AnsweringLiveQuestionHub : AbpHubBase, ITransientDependency
    {
        public async Task AnswerLiveQuestion(QuestionDto question)
        {
            await Clients.All.SendAsync(nameof(HubEvent.AnsweringLiveQuestion), question);
        }
        
        public async Task EndAnswerLiveQuestion(QuestionDto question)
        {
            await Clients.All.SendAsync(nameof(HubEvent.EndAnsweringLiveQuestion), question);
        }
    }
}