using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Notifications;
using Abp.Timing;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Notifications.Dto;
using Academically.Users.Dto;
using Amazon.SimpleEmail.Model;
using Microsoft.EntityFrameworkCore;
using static System.Collections.Specialized.BitVector32;

namespace Academically.Services.Notifications
{
    public class NotificationsAppService : AcademicallyAppServiceBase, INotificationsAppService
    {
        private const int MAX_RECENT_NOTIFICATIONS = 5;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<Notification, Guid> _notificationsRepository;
        private readonly IRepository<NotificationUser, Guid> _notificationUsersRepository;
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IUserNotificationManager _userNotificationManager;

        public NotificationsAppService
        (
            IDocumentsDomainService documentsDomainService,
            IRepository<Notification, Guid> notificationsRepository,
            IRepository<NotificationUser, Guid> notificationUsersRepository,
            IRepository<Post, Guid> postsRepository,
            IRepository<Comment, Guid> commentsRepository,
            IRepository<User, long> usersRepository
        )
        {
            _documentsDomainService = documentsDomainService;
            _notificationsRepository = notificationsRepository;
            _notificationUsersRepository = notificationUsersRepository;
            _postsRepository = postsRepository;
            _commentsRepository = commentsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<IEnumerable<UserNotification>> GetRecent()
        {
            var userIdentifier = new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value);
            return await _userNotificationManager.GetUserNotificationsAsync(userIdentifier, maxResultCount: MAX_RECENT_NOTIFICATIONS);
        }

        public async Task<PagedResultDto<UserNotification>> GetAllPaged(PagedNotificationRequestDto input)
        {
            var userIdentifier = new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value);
            var totalCount = await _userNotificationManager.GetUserNotificationCountAsync(userIdentifier, input.StateFilter);

            var userNotifications = await _userNotificationManager.GetUserNotificationsAsync(
                userIdentifier,
                state: input.StateFilter,
                skipCount: input.SkipCount,
                maxResultCount: input.MaxResultCount
                );

            return new PagedResultDto<UserNotification>(totalCount, userNotifications);
        }

        public async Task UpdateNotificationReadState(System.Guid id)
        {
            await _userNotificationManager.UpdateUserNotificationStateAsync(AbpSession.TenantId, id, UserNotificationState.Read);
        }

        public async Task<NotificationDto> Get(string notificationId)
        {
            var notification = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Where(n => n.Id.ToString() == notificationId)
                .Select(n => ObjectMapper.Map<NotificationDto>(n))
                .FirstOrDefaultAsync();

            if (notification.User != null)
            {
                notification.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(notification.User.ProfilePictureDocumentId.Value);
            }

            foreach (var actor in notification.Actors)
            {
                actor.User = ObjectMapper.Map<UserDto>(await this._usersRepository.GetAsync(actor.UserId));
                actor.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(actor.User.ProfilePictureDocumentId.Value);
            }

            notification.FormattedNotification = await this.FormatNotification(notification);

            return notification;
        }
        public async Task<IList<NotificationDto>> GetLatest(int take)
        {
            var notifications = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .OrderByDescending(n => n.CreationTime)
                .Where(n => n.UserId == AbpSession.UserId.Value)
                .Where(n => n.IsDeleted == false)
                .Take(take)
                .Select(n => ObjectMapper.Map<NotificationDto>(n))
                .ToListAsync();

            foreach(var notification in notifications)
            {
                if (notification.User != null)
                {
                    notification.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(notification.User.ProfilePictureDocumentId.Value);
                }

                foreach (var actor in notification.Actors)
                {
                    actor.User = ObjectMapper.Map<UserDto>(await this._usersRepository.GetAsync(actor.UserId));
                    actor.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(actor.User.ProfilePictureDocumentId.Value);
                }

                notification.FormattedNotification = await this.FormatNotification(notification);
            }

            return notifications;
        }

        public async Task<IList<NotificationDto>> GetAll()
        {
            var notifications = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .OrderByDescending(n => n.CreationTime)
                .Where(n => n.UserId == AbpSession.UserId.Value)
                .Where(n => n.IsDeleted == false)
                .Select(n => ObjectMapper.Map<NotificationDto>(n))
                .ToListAsync();

            foreach (var notification in notifications)
            {
                if (notification.User != null)
                {
                    notification.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(notification.User.ProfilePictureDocumentId.Value);
                }

                foreach (var actor in notification.Actors)
                {
                    actor.User = ObjectMapper.Map<UserDto>(await this._usersRepository.GetAsync(actor.UserId));
                    actor.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(actor.User.ProfilePictureDocumentId.Value);
                }

                notification.FormattedNotification = await this.FormatNotification(notification);
            }

            return notifications;
        }

        public async Task<NotificationDto> Create(CreateNotificationDto input)
        {
            if (input.UserId == input.ActorId) return null;
            var latestUserNotification = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .OrderByDescending(n => n.CreationTime)
                .Where(n => n.UserId == input.UserId)
                .Where(n => n.IsDeleted == false)
                .Where(n => n.ReadTime == null)
                .Where(n => n.Action == input.Action)
                .Where(n => n.Target == input.Target)
                .Where(n => n.ReferenceId == input.ReferenceId)
                .FirstOrDefaultAsync();

            if (latestUserNotification == null)
            {
                latestUserNotification = await this._notificationsRepository.InsertAsync(new Notification()
                {
                    UserId = input.UserId,
                    Action = input.Action,
                    Target = input.Target,
                    ReferenceId = input.ReferenceId,
                    Url = input.Url,
                });

                await this.CurrentUnitOfWork.SaveChangesAsync();
            }

            if (latestUserNotification.Actors == null || !latestUserNotification.Actors.Any(a => a.UserId == input.ActorId))
            {
                await this._notificationUsersRepository.InsertAsync(new NotificationUser()
                {
                    UserId = input.ActorId,
                    NotificationId = latestUserNotification.Id
                });
            }

            latestUserNotification.ReadTime = null;
            latestUserNotification.LastModifierUserId = input.ActorId;
            latestUserNotification.LastModificationTime = Clock.Now;

            return await this.Get(latestUserNotification.Id.ToString());
        }

        public async Task<NotificationDto> Read(string notificationId)
        {
            var notification = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Where(n => n.Id.ToString() == notificationId)
                .FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.ReadTime = DateTime.Now;
            }

            return ObjectMapper.Map<NotificationDto>(notification);
        }

        public async Task<NotificationDto> Unread(string notificationId)
        {
            var notification = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Where(n => n.Id.ToString() == notificationId)
                .FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.ReadTime = null;
            }

            return ObjectMapper.Map<NotificationDto>(notification);
        }

        private async Task<string> FormatNotification(NotificationDto notification)
        {
            List<string> formatted = new List<String>();
            formatted.Add(await this.FormatActors(notification.Actors.Select(a => a.User).ToList()));
            formatted.Add(await this.FormatVerb(notification.Action));
            formatted.Add(await this.FormatPronoun());
            formatted.Add(await this.FormatTarget(notification.Target));

            if (await this.NotificationHasLocation(notification))
            {
                formatted.Add(await this.FormatLocation(notification));
            }
            return $"{ formatted.Where(f => f != null).ToList().JoinAsString(" ")}.";
        }

        private async Task<string> NotificationActionToText(NotificationAction action)
        {
            switch (action)
            {
                case NotificationAction.Like:
                    return "liked";
                case NotificationAction.Share:
                    return "shared";
                case NotificationAction.Comment:
                    return "commented";
                case NotificationAction.Reply:
                    return "replied";
                case NotificationAction.Answer:
                    return "answered";
                default:
                    return "reacted";
            }
        }

        private async Task<string> NotificationTargetToText(NotificationTarget target)
        {
            switch (target)
            {
                case NotificationTarget.Answer:
                    return "answer";
                case NotificationTarget.Question:
                    return "question";
                case NotificationTarget.Reply:
                    return "reply";
                case NotificationTarget.Comment:
                    return "comment";
                default:
                    return "post";
            }
        }

        private async Task<bool> NotificationHasLocation(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Answer) return false;
            if (notification.Action == NotificationAction.Reply) return false;
            if (notification.Action == NotificationAction.Comment) return false;
            if (notification.Action == NotificationAction.Share) return false;
            if (notification.Actors.Count > 1 && notification.Action != NotificationAction.Like && notification.Action != NotificationAction.React) return false;
            return true;
        }

        private async Task<string> FormatActors(List<UserDto> actors) {
            var textinfo = new CultureInfo("en-US", false).TextInfo;
            if (actors.Count == 1)
            {
                return $"<span>{textinfo.ToTitleCase(actors.ElementAt(0).FullName)}</span>";
            }
            else if (actors.Count == 2)
            {
                return $"<span>{textinfo.ToTitleCase(actors.ElementAt(0).FullName)}</span> and <span>{textinfo.ToTitleCase(actors.ElementAt(1).FullName)}</span>";
            }
            else
            {
                return $"<span>{textinfo.ToTitleCase(actors.ElementAt(0).FullName)}</span> and <span>{actors.Count - 1} others</span>";
            }
        }

        private async Task<string> FormatVerb(NotificationAction action)
        {
            return await this.NotificationActionToText(action);
        }

        private async Task<string> FormatPronoun()
        {
            return "your";
        }

        private async Task<string> FormatTarget(NotificationTarget target)
        {
            return await this.NotificationTargetToText(target);
        }

        private async Task<string> FormatLocation(NotificationDto notification)
        {
            string location = null;

            var post = await this._postsRepository.GetAll()
                .Include(p => p.Parent)
                .Where(p => p.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            if (post != null)
            {
                if (post.Parent != null) location = $"in <span>{post.Parent.Title ?? post.Parent.Content}:</span> \"{post.Title ?? post.Content}\"";
                else location = $"\"{post.Title ?? post.Content}\"";
            }
            else
            {
                var comment = await this._commentsRepository.GetAll()
                    .Include(p => p.Parent)
                    .Where(p => p.Id == notification.ReferenceId)
                    .FirstOrDefaultAsync();

                if (comment != null)
                {
                    var parentPost = await this._postsRepository.GetAll()
                            .Include(p => p.Parent)
                            .Where(p => p.Id.ToString() == comment.ReferenceId)
                            .FirstOrDefaultAsync();

                    if (parentPost != null && parentPost.Parent != null)
                    {
                        location = $"in <span>{parentPost.Parent.Title ?? parentPost.Parent.Content}:</span> \"{comment.Body}\"";
                    }
                    else
                    {
                        location = $"\"{comment.Body}\"";
                    }

                }
            }
            return location;
        }
    }
}
