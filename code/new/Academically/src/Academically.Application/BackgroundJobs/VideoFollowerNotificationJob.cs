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
    public class VideoFollowerNotificationJob : AsyncBackgroundJob<VideoFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Video, Guid> _videosRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public VideoFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Video, Guid> videosRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _videosRepository = videosRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(VideoFollowerNotificationJobArgs args)
        {
            var video = await this._videosRepository.FirstOrDefaultAsync(args.ServiceId);
            if (video == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                if (video.Status == VideoStatus.Published)
                {
                    var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == video.CreatorUserId);
                    var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();

                    foreach (var userId in userIds)
                    {
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = video.CreatorUserId.Value,
                            Action = NotificationAction.Create,
                            Target = NotificationTarget.Tutorial,
                            ReferenceId = video.Id,
                            SourceId = video.Id,
                            Url = $"app/videos/student-portal/{video.Id}"
                        }, BackgroundJobPriority.High);
                    }
                }

                await uow.CompleteAsync();
            }
        }
    }
}
