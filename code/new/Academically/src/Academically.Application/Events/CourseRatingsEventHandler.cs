using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Runtime.Session;
using Academically.Domain.Entities;
using System.Threading.Tasks;
using Academically.Domain.Enums;
using Abp.BackgroundJobs;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;

namespace Academically.Events
{
    public class CourseRatingsEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<CourseRating>>,
        IAsyncEventHandler<EntityUpdatedEventData<CourseRating>>,
        IAsyncEventHandler<EntityDeletedEventData<CourseRating>>
    {
        private readonly IAbpSession _abpSession;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CourseRatingsEventHandler(IAbpSession abpSession,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _abpSession = abpSession;
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<CourseRating> eventData)
        {
            var currentUserId = _abpSession.GetUserId();
            await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
            {
                UserId = eventData.Entity.ServiceOwnerId.Value,
                ActorId = currentUserId,
                Action = NotificationAction.Review,
                Target = NotificationTarget.Course,
                ReferenceId = eventData.Entity.CourseId,
                SourceId = eventData.Entity.Id,
                Url = $"app/course/{eventData.Entity.CourseId}/review"
        });
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<CourseRating> eventData)
        {
        }

        public async Task HandleEventAsync(EntityDeletedEventData<CourseRating> eventData)
        {
        }
    }
}
