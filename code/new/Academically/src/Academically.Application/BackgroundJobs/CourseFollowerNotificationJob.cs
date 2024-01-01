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
    public class CourseFollowerNotificationJob : AsyncBackgroundJob<CourseFollowerNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IBackgroundJobManager _backgroundJobManager;

        public CourseFollowerNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            IRepository<Course, Guid> coursesRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IBackgroundJobManager backgroundJobManager
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _coursesRepository = coursesRepository;
            _userFollowersRepository = userFollowersRepository;
            _backgroundJobManager = backgroundJobManager;
        }

        public override async Task ExecuteAsync(CourseFollowerNotificationJobArgs args)
        {
            var course = await this._coursesRepository.FirstOrDefaultAsync(args.ServiceId);
            if (course == null) return;

            using (var uow = _unitOfWorkManager.Begin())
            {
                if (course.Status == CourseStatus.Published)
                {
                    var followers = await this._userFollowersRepository.GetAllListAsync(u => u.UserId == course.CreatorUserId);
                    var userIds = followers.Select(x => x.CreatorUserId).Where(x => x != null).ToList();

                    foreach (var userId in userIds)
                    {
                        await _backgroundJobManager.EnqueueAsync<CreateNotificationJob, CreateNotificationJobArgs>(new CreateNotificationJobArgs()
                        {
                            UserId = userId.Value,
                            ActorId = course.CreatorUserId.Value,
                            Action = NotificationAction.Create,
                            Target = NotificationTarget.Course,
                            ReferenceId = course.Id,
                            SourceId = course.Id,
                            Url = $"app/course/{course.Id}/about"
                        }, BackgroundJobPriority.High);
                    }
                }

                await uow.CompleteAsync();
            }
        }
    }
}
