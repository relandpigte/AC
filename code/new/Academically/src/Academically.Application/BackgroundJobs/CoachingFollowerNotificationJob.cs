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
    public class CoachingFollowerNotificationJob : AsyncBackgroundJob<CoachingFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Coaching, Guid> _coachingsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CoachingFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Coaching, Guid> coachingsRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _coachingsRepository = coachingsRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(CoachingFollowerNotificationJobArgs args)
        {
            var coaching = await this._coachingsRepository.FirstOrDefaultAsync(args.ServiceId);
            if (coaching == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                if (coaching.Status == CoachingStatus.Published)
                {
                    var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == coaching.CreatorUserId);
                    var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();

                    foreach (var userId in userIds)
                    {
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = coaching.CreatorUserId.Value,
                            Action = NotificationAction.Create,
                            Target = NotificationTarget.Coaching,
                            ReferenceId = coaching.Id,
                            SourceId = coaching.Id,
                            Url = $"app/coaching/{coaching.Id}/about"
                        }, BackgroundJobPriority.High);
                    }
                }

                await uow.CompleteAsync();
            }
        }
    }
}
