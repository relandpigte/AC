using Abp;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Abp.Notifications;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Emails;
using Academically.Notifications;
using SourceCloud.Core.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Domain.Events.Handlers
{
    public class EventPresentersEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<EventPresenter>>,
        IAsyncEventHandler<EntityUpdatedEventData<EventPresenter>>
    {
        private readonly EmailTemplateHelper _emailTemplateHelper;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<Event, Guid> _eventsRepository;
        private readonly IEmailService _emailService;
        private readonly INotificationPublisher _notificationPublisher;
        private readonly ISettingManager _settingManager;

        public EventPresentersEventHandler(
            EmailTemplateHelper emailTemplateHelper,
            IRepository<User, long> usersRepository,
            IRepository<Event, Guid> eventsRepository,
            IEmailService emailService,
            INotificationPublisher notificationPublisher,
            ISettingManager settingManager,
            ILocalizationManager localizationManager
            )
            : base(localizationManager)
        {
            _emailTemplateHelper = emailTemplateHelper;
            _usersRepository = usersRepository;
            _eventsRepository = eventsRepository;
            _emailService = emailService;
            _notificationPublisher = notificationPublisher;
            _settingManager = settingManager;
        }

        public async Task HandleEventAsync(EntityCreatedEventData<EventPresenter> eventData)
        {
            var eventPresenter = eventData.Entity;
            var recipient = await _usersRepository.GetAsync(eventPresenter.UserId);
            var host = await _usersRepository.GetAsync(eventPresenter.CreatorUserId.Value);
            var @event = await _eventsRepository.GetAsync(eventPresenter.EventId);

            string clientRootAddress = (await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress)).Trim('/');
            string acceptInvitationLink = $"{clientRootAddress}/pages/invitations/event/{eventPresenter.Id}?status={(int)EventPresenterStatus.Accepted}";
            string rejectInvitationLink = $"{clientRootAddress}/pages/invitations/event/{eventPresenter.Id}?status={(int)EventPresenterStatus.Rejected}";

            string emailBody = await _emailTemplateHelper.GetTemplate("event-invitation.html", new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("recipientName", recipient.Name),
                new KeyValuePair<string, string>("eventName", @event.Name),
                new KeyValuePair<string, string>("hostName", host.FullName),
                new KeyValuePair<string, string>("acceptInvitationLink", acceptInvitationLink),
                new KeyValuePair<string, string>("rejectInvitationLink", rejectInvitationLink),
            });
            await _emailService.SendAsync(recipient.Name, recipient.EmailAddress, L("EventInvitationEmailSuject"), emailBody);

            var notificationData = new LocalizableMessageNotificationData(new LocalizableString("EventInvitationNotificationMessage", AcademicallyConsts.LocalizationSourceName));
            notificationData["0"] = host.FullName;
            notificationData["1"] = @event.Name;
            notificationData.Properties.Add("Link", acceptInvitationLink);
            notificationData.Properties.Add("CreatorUserId", host.Id);

            await _notificationPublisher.PublishAsync(
                NotificationNames.Notifications_Events_Invitation,
                notificationData,
                userIds: new[] { new UserIdentifier(recipient.TenantId, recipient.Id) }
            );
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<EventPresenter> eventData)
        {
            var eventPresenter = eventData.Entity;
            var recipient = await _usersRepository.GetAsync(eventPresenter.UserId);
            var host = await _usersRepository.GetAsync(eventPresenter.CreatorUserId.Value);
            var @event = await _eventsRepository.GetAsync(eventPresenter.EventId);

            switch (eventPresenter.Status)
            {
                case EventPresenterStatus.Accepted:

                    string clientRootAddress = (await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress)).Trim('/');
                    string joinEventLink = $"{clientRootAddress}/app/events/student-portal/{@event.Id}/portal";

                    string inviteeEmailBody = await _emailTemplateHelper.GetTemplate("event-invitation-accepted-invitee.html", new List<KeyValuePair<string, string>>
                    {
                        new KeyValuePair<string, string>("eventName", @event.Name),
                        new KeyValuePair<string, string>("recipientName", recipient.Name),
                        new KeyValuePair<string, string>("joinEventLink", joinEventLink),
                    });

                    string hostEmailBody = await _emailTemplateHelper.GetTemplate("event-invitation-accepted-host.html", new List<KeyValuePair<string, string>>
                    {
                        new KeyValuePair<string, string>("hostName", host.FullName),
                        new KeyValuePair<string, string>("recipientName", recipient.Name),
                        new KeyValuePair<string, string>("eventName", @event.Name),
                    });

                    await _emailService.SendAsync(recipient.Name, recipient.EmailAddress, L("EventInvitationAcceptedEmailSuject"), inviteeEmailBody);
                    await _emailService.SendAsync(host.Name, host.EmailAddress, L("EventInvitationAcceptedEmailSuject"), hostEmailBody);

                    var eventAcceptedNotificationData = new LocalizableMessageNotificationData(new LocalizableString("EventInvitatonAcceptedNotificationMessage", AcademicallyConsts.LocalizationSourceName));
                    eventAcceptedNotificationData["0"] = host.FullName;
                    eventAcceptedNotificationData["1"] = @event.Name;
                    eventAcceptedNotificationData.Properties.Add("CreatorUserId", host.Id);

                    await _notificationPublisher.PublishAsync(
                        NotificationNames.Notifications_Events_Invitation_Accepted,
                        eventAcceptedNotificationData,
                        userIds: new[] { new UserIdentifier(host.TenantId, host.Id) }
                    );
                    break;
                case EventPresenterStatus.Rejected:
                    var eventRejectedNotificationData = new LocalizableMessageNotificationData(new LocalizableString("EventInvitatonRejectedNotificationMessage", AcademicallyConsts.LocalizationSourceName));
                    eventRejectedNotificationData["0"] = host.FullName;
                    eventRejectedNotificationData["1"] = @event.Name;
                    eventRejectedNotificationData.Properties.Add("CreatorUserId", host.Id);

                    await _notificationPublisher.PublishAsync(
                        NotificationNames.Notifications_Events_Invitation_Accepted,
                        eventRejectedNotificationData,
                        userIds: new[] { new UserIdentifier(host.TenantId, host.Id) }
                    );
                    break;
            }
        }
    }
}
