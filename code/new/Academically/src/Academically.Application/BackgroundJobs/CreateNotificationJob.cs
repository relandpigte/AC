using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Academically.BackgroundJobs.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Notifications;
using Academically.Services.Notifications.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs
{
    public class CreateNotificationJob : AsyncBackgroundJob<CreateNotificationJobArgs>, ITransientDependency
    {
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly INotificationsAppService _notificationsAppService;

        public CreateNotificationJob(
            IUnitOfWorkManager unitOfWorkManager,
            INotificationsAppService notificationsAppService
        )
        {
            _unitOfWorkManager = unitOfWorkManager;
            _notificationsAppService = notificationsAppService;
        }

        public override async Task ExecuteAsync(CreateNotificationJobArgs args)
        {
            using (var uow = _unitOfWorkManager.Begin())
            {
                await this._notificationsAppService.Create(new CreateNotificationDto()
                {
                    UserId = args.UserId,
                    ActorId = args.ActorId,
                    Action = args.Action,
                    Target = args.Target,
                    ReferenceId = args.ReferenceId,
                    SourceId = args.SourceId,
                    Url = args.Url,
                    AdditionalData = args.AdditionalData
                });

                await uow.CompleteAsync();
            }
        }
    }
}
