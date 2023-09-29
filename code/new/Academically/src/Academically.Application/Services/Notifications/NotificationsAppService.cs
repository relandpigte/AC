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
using Academically.Services.Posts;
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
        private readonly IRepository<ServiceDiscussion, long> _serviceDiscussionRepository;
        private readonly IUserNotificationManager _userNotificationManager;
        private readonly IPostsAppService _postsAppService;

        public NotificationsAppService
        (
            IDocumentsDomainService documentsDomainService,
            IRepository<Notification, Guid> notificationsRepository,
            IRepository<NotificationUser, Guid> notificationUsersRepository,
            IRepository<Post, Guid> postsRepository,
            IRepository<Comment, Guid> commentsRepository,
            IRepository<User, long> usersRepository,
            IRepository<ServiceDiscussion, long> serviceDiscussionRepository,
            IPostsAppService postsAppService
        )
        {
            _documentsDomainService = documentsDomainService;
            _notificationsRepository = notificationsRepository;
            _notificationUsersRepository = notificationUsersRepository;
            _postsRepository = postsRepository;
            _commentsRepository = commentsRepository;
            _usersRepository = usersRepository;
            _serviceDiscussionRepository = serviceDiscussionRepository;
            _postsAppService = postsAppService;
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

            var post = await this._postsRepository.GetAll()
                .Include(p => p.Parent)
                .Where(p => p.Id == input.ReferenceId)
                .FirstOrDefaultAsync();

            var latestUserNotification = this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .OrderByDescending(n => n.CreationTime)
                .Where(n => n.UserId == input.UserId)
                .Where(n => n.IsDeleted == false)
                .Where(n => n.ReadTime == null)
                .Where(n => n.Action == input.Action)
                .Where(n => n.Target == input.Target)
                .WhereIf(post?.Parent == null || post?.Parent?.Type != PostType.Discussion, n => n.ReferenceId == input.ReferenceId)
                .FirstOrDefault();

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
            var references = await this.InitialNotificationReferences(notification);

            List<string> formatted = new List<String>();

            formatted.Add(await this.FormatActors(notification.Actors.Select(a => a.User).ToList()));

            formatted.Add(" ");
            formatted.Add(await this.FormatVerb(notification));

            if (await this.NotificationHasPronoun(notification))
            {
                var pronoun = await this.FormatPronoun();
                if (!string.IsNullOrEmpty(pronoun))
                {
                    formatted.Add(" ");
                    formatted.Add(pronoun);
                }
            }

            if (await this.NotificationHasTarget(notification))
            {
                var target = await this.FormatTarget(notification);
                if (!string.IsNullOrEmpty(target))
                {
                    formatted.Add(" ");
                    formatted.Add(target);
                }
            }

            if (await this.NotificationHasLocation(notification))
            {
                var location = await this.FormatLocation(references);
                if (!string.IsNullOrEmpty(location))
                {
                    formatted.Add(" ");
                    formatted.Add(location);
                }
            }

            if (await this.NotificationHasObject(notification))
            {
                var obj = await this.FormatObject(references);
                if (!string.IsNullOrEmpty(obj))
                {
                    formatted.Add(": ");
                    formatted.Add($"\"{obj}\"");
                }
            }

            return $"{ formatted.Where(f => f != null).ToList().JoinAsString(string.Empty)}.";
        }

        private async Task<NotificationReferencesDto> InitialNotificationReferences(NotificationDto notification)
        {
            NotificationReferencesDto references = new NotificationReferencesDto();

            references.Post = await this._postsRepository.GetAll()
                .Include(p => p.Parent)
                .Where(p => p.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            if (references.Post != null)
            {
                references.Discussion = await this._serviceDiscussionRepository.GetAll()
                    .Where(s => s.PostId == references.Post.Id)
                    .FirstOrDefaultAsync();

                if (references.Discussion != null)
                {
                    references.DiscussionService = await this._postsAppService.GetAvailableService(references.Discussion.ServiceId);
                }
            }

            references.Comment = await this._commentsRepository.GetAll()
                .Include(p => p.Parent)
                .Where(p => p.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            if (references.Comment != null)
            {
                references.ParentPost = await this._postsRepository.GetAll()
                    .Include(p => p.Parent)
                    .Where(p => p.Id.ToString() == references.Comment.ReferenceId)
                    .FirstOrDefaultAsync();
            }

            return references;
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
                    return "commented on";
                case NotificationAction.Reply:
                    return "replied to";
                case NotificationAction.Answer:
                    return "answered";
                case NotificationAction.Post:
                    return "posted";
                default:
                    return "reacted";
            }
        }

        private async Task<string> NotificationTargetToText(NotificationTarget target, NotificationAction action)
        {
            switch (target)
            {
                case NotificationTarget.Answer:
                    return "answer";
                case NotificationTarget.Question:
                    return "question";
                case NotificationTarget.Reply:
                    if (action == NotificationAction.Like || action == NotificationAction.React)
                        return "reply";
                    return "comment";
                case NotificationTarget.Comment:
                    return "comment";
                default:
                    return "post";
            }
        }

        private async Task<bool> NotificationHasTarget(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Post) return false;
            return true;
        }

        private async Task<bool> NotificationHasPronoun(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Post) return false;
            return true;
        }

        private async Task<bool> NotificationHasLocation(NotificationDto notification)
        {
            if (notification.Actors.Count > 1)
            {
                if (notification.Action == NotificationAction.Answer) return false;
                if (notification.Action == NotificationAction.Reply) return false;
                if (notification.Action == NotificationAction.Comment) return false;
                if (notification.Action == NotificationAction.Share) return false;
            }
            return true;
        }

        private async Task<bool> NotificationHasObject(NotificationDto notification)
        {
            if (notification.Actors.Count > 1)
            {
                if (notification.Action == NotificationAction.Post && notification.Target == NotificationTarget.Post) return false;
            }
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

        private async Task<string> FormatVerb(NotificationDto notification)
        {
            return await this.NotificationActionToText(notification.Action);
        }

        private async Task<string> FormatPronoun()
        {
            return "your";
        }

        private async Task<string> FormatTarget(NotificationDto notification)
        {
            return await this.NotificationTargetToText(notification.Target, notification.Action);
        }

        private async Task<string> FormatLocation(NotificationReferencesDto references)
        {
            var referencePost = references.ParentPost?.Parent ?? references.Post?.Parent;
            string location = null;
            if (referencePost != null)
            {
                if (references.Discussion == null) location = $"in <span>{referencePost.Title ?? referencePost.Content}</span>";
                else
                {
                    if (references.DiscussionService == null) location = $"in <span>{referencePost.Title ?? referencePost.Content}</span>";
                    else
                    {
                        location = $"in <span>{references.DiscussionService.Name}</span>";
                    }
                }
            }
            return location;
        }

        private async Task<string> FormatObject(NotificationReferencesDto references)
        {
            string obj = null;
            if (references.Post != null)
                obj = $"{references.Post.Title ?? references.Post.Content}";
            else if (references.Comment != null)
                obj = $"{references.Comment.Body}";
            return obj;
        }

    }
}
