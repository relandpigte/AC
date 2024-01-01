using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Academically.BackgroundJobs.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class EventFollowerNotificationJob : AsyncBackgroundJob<EventFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Event, Guid> _eventsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public EventFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Event, Guid> eventsRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _eventsRepository = eventsRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(EventFollowerNotificationJobArgs args)
        {
            var eventService = await this._eventsRepository.FirstOrDefaultAsync(args.ServiceId);
            if (eventService == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                if (eventService.Status == EventStatus.Published)
                {
                    var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == eventService.CreatorUserId);
                    var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();
                    var target = eventService.Category == EventCategory.Broadcast ? NotificationTarget.Broadcast : NotificationTarget.Workshop;

                    foreach (var userId in userIds)
                    {
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = eventService.CreatorUserId.Value,
                            Action = NotificationAction.Create,
                            Target = target,
                            ReferenceId = eventService.Id,
                            SourceId = eventService.Id,
                            Url = $"app/events/{eventService.Id}/about"
                        }, BackgroundJobPriority.High);
                    }
                }

                await uow.CompleteAsync();
            }
        }
    }
}
