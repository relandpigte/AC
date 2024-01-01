using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Academically.BackgroundJobs.Dto;
using Academically.BackgroundJobs;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Threading.Tasks;

namespace Academically.Events
{
    public class CoursesEventHandler : ITransientDependency,
        IAsyncEventHandler<EntityCreatedEventData<Course>>,
        IAsyncEventHandler<EntityUpdatedEventData<Course>>
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CoursesEventHandler(
            IBackgroundJobManager backgroundJobManager
        )
        {
            _backgroundJobManager = backgroundJobManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<Course> eventData)
        {
            if (eventData.Entity.Status == CourseStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<CourseFollowerNotificationJob, CourseFollowerNotificationJobArgs>(new CourseFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Course> eventData)
        {
            if (eventData.Entity.Status == CourseStatus.Published)
            {
                await _backgroundJobManager.EnqueueAsync<CourseFollowerNotificationJob, CourseFollowerNotificationJobArgs>(new CourseFollowerNotificationJobArgs() { ServiceId = eventData.Entity.Id });
            }
        }
    }
}
