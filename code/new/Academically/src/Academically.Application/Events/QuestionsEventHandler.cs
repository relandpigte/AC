using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using Academically.Hubs;
using System.Threading.Tasks;
using Academically.Services.Questions;

namespace Academically.Events
{
    public class QuestionsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Question>>,
        IAsyncEventHandler<EntityUpdatedEventData<Question>>,
        IAsyncEventHandler<EntityDeletedEventData<Question>>
    {
        private readonly IHubManager _hubManager;
        private readonly IQuestionsAppService _questionsAppService;

        public QuestionsEventHandler(
            IHubManager hubManager,
            IQuestionsAppService questionsAppService)
        {
            _hubManager = hubManager;
            _questionsAppService = questionsAppService;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Question> eventData)
        {
            var question = await _questionsAppService.GetAsync(eventData.Entity.Id);
            await _hubManager.NotifyUsersForQuestionCreated(question);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Question> eventData)
        {
            var question = await _questionsAppService.GetAsync(eventData.Entity.Id);
            await _hubManager.NotifyUsersForQuestionUpdated(question);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<Question> eventData)
        {
            var question = await _questionsAppService.GetAsync(eventData.Entity.Id);
            await _hubManager.NotifyUsersForQuestionDeleted(question);
        }
    }
}
