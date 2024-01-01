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
    public class FollowingFollowerNotificationJob : AsyncBackgroundJob<FollowingFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public FollowingFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Post, Guid> postsRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _postsRepository = postsRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(FollowingFollowerNotificationJobArgs args)
        {
            var userFollower = await this._userFollowersRepository.FirstOrDefaultAsync(args.UserFollowerId);
            if (userFollower == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                var followers = await this._userFollowersRepository.GetAllListAsync(u => u.Id != userFollower.Id && u.UserId == userFollower.CreatorUserId);
                var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();
                var userGuid = $"{AppConsts.DefaultTempGuid}{($"{userFollower.UserId}".PadLeft(12, 'f'))}";

                foreach (var userId in userIds)
                {
                    await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                    {
                        UserId = userId.Value,
                        ActorId = userFollower.CreatorUserId.Value,
                        Action = NotificationAction.Follow,
                        Target = NotificationTarget.User,
                        ReferenceId = new Guid(userGuid),
                        SourceId = userFollower.Id,
                    }, BackgroundJobPriority.High);
                }

                await uow.CompleteAsync();
            }
        }
    }
}
