using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.Domain.Entities;
using Academically.Hubs;
using System.Threading.Tasks;
using Abp.ObjectMapping;
using Academically.Services.Questions;
using Academically.Services.Questions.Dto;

namespace Academically.Events
{
    public class QuestionsReactionsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<QuestionReaction>>,
        IAsyncEventHandler<EntityUpdatedEventData<QuestionReaction>>,
        IAsyncEventHandler<EntityDeletedEventData<QuestionReaction>>
    {
        private readonly IHubManager _hubManager;
        private readonly IObjectMapper _objectMapper;

        public QuestionsReactionsEventHandler(
            IObjectMapper objectMapper,
            IHubManager hubManager,
            IQuestionsAppService questionsAppService)
        {
            _hubManager = hubManager;
            _objectMapper = objectMapper;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<QuestionReaction> eventData)
        {
            var reaction = _objectMapper.Map<QuestionReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForQuestionReactionCreated(reaction);
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<QuestionReaction> eventData)
        {
            var reaction = _objectMapper.Map<QuestionReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForQuestionReactionUpdated(reaction);
        }

        public async Task HandleEventAsync(EntityDeletedEventData<QuestionReaction> eventData)
        {
            var reaction = _objectMapper.Map<QuestionReactionDto>(eventData.Entity);
            await _hubManager.NotifyUsersForQuestionReactionDeleted(reaction);
        }
    }
}