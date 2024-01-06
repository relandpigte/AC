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
    public class ServiceReviewFollowerNotificationJob : AsyncBackgroundJob<ServiceReviewFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<ServiceReview, Guid> _serviceReviewsRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public ServiceReviewFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<ServiceReview, Guid> serviceReviewsRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _serviceReviewsRepository = serviceReviewsRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(ServiceReviewFollowerNotificationJobArgs args)
        {
            var userReview = await this._serviceReviewsRepository.FirstOrDefaultAsync(args.ServiceReviewId);
            if (userReview == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == userReview.CreatorUserId);
                var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();
                var target = this.getNotificationTarget(userReview.ServiceType);
                var url = this.getServiceUrl(userReview.ServiceType, userReview.ReferenceId);

                foreach (var userId in userIds)
                {
                    await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                    {
                        UserId = userId.Value,
                        ActorId = userReview.CreatorUserId.Value,
                        Action = NotificationAction.Review,
                        Target = target,
                        ReferenceId = userReview.ReferenceId,
                        SourceId = userReview.Id,
                        Url = url
                    }, BackgroundJobPriority.High);
                }

                await uow.CompleteAsync();
            }
        }

        private NotificationTarget getNotificationTarget(ServicesType type)
        {
            switch (type)
            {
                case ServicesType.Article:
                    return NotificationTarget.Article;
                case ServicesType.Event:
                    return NotificationTarget.Broadcast;
                case ServicesType.Coaching:
                    return NotificationTarget.Coaching;
                case ServicesType.Course:
                    return NotificationTarget.Course;
                case ServicesType.Tutorial:
                    return NotificationTarget.Tutorial;
                default:
                    return NotificationTarget.Workshop;
            }
        }

        private string getServiceUrl(ServicesType type, Guid id)
        {
            switch (type)
            {
                case ServicesType.Article:
                    return $"/app/articles/student-portal/{id}";
                case ServicesType.Event:
                    return $"/app/events/{id}/about";
                case ServicesType.Coaching:
                    return $"app/coaching/{id}/reviews";
                case ServicesType.Course:
                    return $"app/course/{id}/reviews";
                case ServicesType.Tutorial:
                    return $"app/videos/student-portal/{id}";
                default:
                    return $"/app/events/{id}/about";
            }
        }
    }
}
