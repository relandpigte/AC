using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Notifications;
using Abp.Timing;
using Academically.Authorization.Users;
using Academically.Domain;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Comments;
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
        private readonly IRepository<Post, Guid> _postsRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<ServiceDiscussion, long> _serviceDiscussionRepository;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<Coaching, Guid> _coachingsRepository;
        private readonly IRepository<Video, Guid> _videosRepository;
        private readonly IRepository<Event, Guid> _eventsRepository;
        private readonly IUserNotificationManager _userNotificationManager;

        public NotificationsAppService
        (
            IDocumentsDomainService documentsDomainService,
            IRepository<Notification, Guid> notificationsRepository,
            IRepository<Post, Guid> postsRepository,
            IRepository<Comment, Guid> commentsRepository,
            IRepository<User, long> usersRepository,
            IRepository<ServiceDiscussion, long> serviceDiscussionRepository,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Course, Guid> coursesRepository,
            IRepository<Coaching, Guid> coachingsRepository,
            IRepository<Video, Guid> videosRepository,
            IRepository<Event, Guid> eventsRepository
        )
        {
            _documentsDomainService = documentsDomainService;
            _notificationsRepository = notificationsRepository;
            _postsRepository = postsRepository;
            _commentsRepository = commentsRepository;
            _usersRepository = usersRepository;
            _serviceDiscussionRepository = serviceDiscussionRepository;
            _articlesRepository = articlesRepository;
            _coursesRepository = coursesRepository;
            _coachingsRepository = coachingsRepository;
            _videosRepository = videosRepository;
            _eventsRepository = eventsRepository;
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
                .Include(n => n.Sources)
                .Where(n => n.Id.ToString() == notificationId)
                .Select(n => ObjectMapper.Map<NotificationDto>(n))
                .FirstOrDefaultAsync();

            if (notification.User?.ProfilePictureDocumentId != null)
                notification.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(notification.User.ProfilePictureDocumentId.Value);

            foreach (var actor in notification.Actors)
            {
                actor.User = ObjectMapper.Map<UserDto>(await this._usersRepository.GetAsync(actor.UserId));
                if (actor.User.ProfilePictureDocumentId != null)
                    actor.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(actor.User.ProfilePictureDocumentId.Value);
            }

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
                if (notification.User?.ProfilePictureDocumentId != null)
                    notification.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(notification.User.ProfilePictureDocumentId.Value);

                foreach (var actor in notification.Actors)
                {
                    actor.User = ObjectMapper.Map<UserDto>(await this._usersRepository.GetAsync(actor.UserId));
                    if (actor.User.ProfilePictureDocumentId != null)
                        actor.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(actor.User.ProfilePictureDocumentId.Value);
                }
            }

            return notifications;
        }

        public async Task<IList<NotificationDto>> GetAll()
        {
            var notifications = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Include(n => n.Sources)
                .OrderByDescending(n => n.CreationTime)
                .Where(n => n.UserId == AbpSession.UserId.Value)
                .Where(n => n.IsDeleted == false)
                .Select(n => ObjectMapper.Map<NotificationDto>(n))
                .ToListAsync();

            foreach (var notification in notifications)
            {
                if (notification.User?.ProfilePictureDocumentId != null)
                    notification.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(notification.User.ProfilePictureDocumentId.Value);

                foreach (var actor in notification.Actors)
                {
                    actor.User = ObjectMapper.Map<UserDto>(await this._usersRepository.GetAsync(actor.UserId));
                    if (actor.User.ProfilePictureDocumentId != null)
                        actor.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(actor.User.ProfilePictureDocumentId.Value);
                }
            }

            return notifications;
        }

        public async Task Create(CreateNotificationDto input)
        {
            if (input.UserId == input.ActorId) return;

            var latestUserNotification = this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Include(n => n.Sources)
                .OrderByDescending(n => n.CreationTime)
                .Where(n => n.UserId == input.UserId)
                .Where(n => n.IsDeleted == false)
                .Where(n => n.ReadTime == null)
                .Where(n => n.Action == input.Action)
                .Where(n => n.Target == input.Target)
                .Where(n => (n.ReferenceId == input.ReferenceId) || n.Action == NotificationAction.Create || n.Action == NotificationAction.Ask || n.Action == NotificationAction.Start)
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
                    FormattedNotification = string.Empty,
                    CreatorUserId = input.ActorId
                });
            }

            if (latestUserNotification.Actors == null || !latestUserNotification.Actors.Any(a => a.UserId == input.ActorId))
            {
                if (latestUserNotification.Actors == null) latestUserNotification.Actors = new List<NotificationUser>();
                latestUserNotification.Actors.Add(new NotificationUser()
                {
                    UserId = input.ActorId,
                    NotificationId = latestUserNotification.Id,
                    CreatorUserId = input.ActorId
                });
            }

            if (latestUserNotification.Sources == null || !latestUserNotification.Sources.Any(s => s.ReferenceId == input.SourceId))
            {
                if (latestUserNotification.Sources == null) latestUserNotification.Sources = new List<NotificationSource>();
                latestUserNotification.Sources.Add(new NotificationSource()
                {
                    ReferenceId = input.SourceId,
                    NotificationId = latestUserNotification.Id
                });
            }

            latestUserNotification.ReadTime = null;
            latestUserNotification.LastModifierUserId = input.ActorId;
            latestUserNotification.LastModificationTime = Clock.Now;

            var dto = ObjectMapper.Map<NotificationDto>(latestUserNotification);
            latestUserNotification.FormattedNotification = await this.GetFormattedNotification(dto);
        }

        public async Task Read(string notificationId)
        {
            var notification = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Include(n => n.Sources)
                .Where(n => n.Id.ToString() == notificationId)
                .FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.ReadTime = DateTime.Now;
            }
        }

        public async Task Unread(string notificationId)
        {
            var notification = await this._notificationsRepository.GetAll()
                .Include(n => n.User)
                .Include(n => n.Actors)
                    .ThenInclude(a => a.User)
                .Include(n => n.Sources)
                .Where(n => n.Id.ToString() == notificationId)
                .FirstOrDefaultAsync();

            if (notification != null)
            {
                notification.ReadTime = null;
            }
        }

        private async Task<string> GetFormattedNotification(NotificationDto notification)
        {
            var references = await this.InitialNotificationReferences(notification);

            List<string> formatted = new List<String>();

            formatted.Add(await this.FormatActors(notification));

            formatted.Add(" ");
            formatted.Add(await this.FormatVerb(notification));

            if (await this.NotificationHasAdverb(notification))
            {
                formatted.Add(" ");
                formatted.Add(await this.FormatAdverb(notification));
            }

            if (await this.NotificationHasPronoun(notification))
            {
                var pronoun = await this.FormatPronoun(notification);
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
                var location = await this.FormatLocation(references, notification);
                if (!string.IsNullOrEmpty(location))
                {
                    formatted.Add(" ");
                    formatted.Add(location);
                }
            }

            if (await this.NotificationHasObject(notification))
            {
                var obj = await this.FormatObject(notification);
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
                .AsNoTracking()
                .Include(p => p.Parent)
                .Where(p => p.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            if (references.Post != null)
            {
                references.Discussion = await this._serviceDiscussionRepository.GetAll()
                    .AsNoTracking()
                    .Where(s => s.PostId == references.Post.Id)
                    .FirstOrDefaultAsync();

                if (references.Discussion != null)
                {
                    references.DiscussionService = await this.GetSimpleService(references.Discussion.ServiceId);
                }
            }

            references.Comment = await this._commentsRepository.GetAll()
                .AsNoTracking()
                .Include(p => p.Parent)
                .Where(p => p.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            if (references.Comment != null)
            {
                references.ParentPost = await this._postsRepository.GetAll()
                    .AsNoTracking()
                    .Include(p => p.Parent)
                    .Where(p => p.Id.ToString() == references.Comment.ReferenceId)
                    .FirstOrDefaultAsync();
            }

            references.Service = await this.GetSimpleService(notification.ReferenceId);

            var matches = Regex.Match(notification.ReferenceId.ToString(), $"{AppConsts.DefaultTempGuid}{@"[f]*(\d+)"}");
            if (matches.Groups.Count > 1)
            {
                var userId = matches.Groups[1].Value;
                references.User = await this._usersRepository.FirstOrDefaultAsync(long.Parse(userId));
            }
           

            return references;
        }

        private async Task<ISimpleService> GetSimpleService(Guid id)
        {
            var article = (ISimpleService) await this._articlesRepository.FirstOrDefaultAsync(id);
            var course = (ISimpleService) await this._coursesRepository.FirstOrDefaultAsync(id);
            var coaching = (ISimpleService) await this._coachingsRepository.FirstOrDefaultAsync(id);
            var video = (ISimpleService) await this._videosRepository.FirstOrDefaultAsync(id);
            var evt = (ISimpleService) await this._eventsRepository.FirstOrDefaultAsync(id);
            return article ?? course ?? coaching ?? video ?? evt;
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
                case NotificationAction.Chat:
                    return "sent";
                case NotificationAction.Purchase:
                    return "purchased";
                case NotificationAction.Enroll:
                    return "enrolled";
                case NotificationAction.Review:
                    return "left a review";
                case NotificationAction.Follow:
                    return "started following";
                case NotificationAction.Create:
                    return "created";
                case NotificationAction.Ask:
                    return "asked";
                case NotificationAction.Start:
                    return "started";
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
                case NotificationTarget.Chat:
                    return "message";
                case NotificationTarget.Article:
                    return "article";
                case NotificationTarget.Broadcast:
                    return "broadcast";
                case NotificationTarget.Coaching:
                    return "coaching session";
                case NotificationTarget.Course:
                    return "course";
                case NotificationTarget.Tutorial:
                    return "tutorial";
                case NotificationTarget.Workshop:
                    return "workshop";
                case NotificationTarget.Post:
                    return "post";
                case NotificationTarget.Discussion:
                    return "discussion";
                default:
                    return "post";
            }
        }

        private async Task<bool> NotificationHasTarget(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Post) return false;
            if (notification.Action == NotificationAction.Follow) return false;
            return true;
        }

        private async Task<bool> NotificationHasPronoun(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Post) return false;
            if (notification.Action == NotificationAction.Create) return false;
            if (notification.Action == NotificationAction.Ask) return false;
            if (notification.Action == NotificationAction.Start) return false;
            if (notification.Action == NotificationAction.Follow) return false;
            return true;
        }

        private async Task<bool> NotificationHasAdverb(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Purchase || notification.Action == NotificationAction.Enroll)
            {
                switch (notification.Target)
                {
                    case NotificationTarget.Broadcast:
                    case NotificationTarget.Workshop:
                    case NotificationTarget.Course:
                        return true;
                }
            }
            if (notification.Action == NotificationAction.Review) return true;
            if (notification.Action == NotificationAction.Create) return true;
            if (notification.Action == NotificationAction.Ask) return true;
            if (notification.Action == NotificationAction.Start) return true;
            return false;
        }

        private async Task<bool> NotificationHasLocation(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Create)
            {
                if (notification.Target == NotificationTarget.Article) return true;
                if (notification.Target == NotificationTarget.Coaching) return true;
                if (notification.Target == NotificationTarget.Course) return true;
                if (notification.Target == NotificationTarget.Tutorial) return true;
                if (notification.Target == NotificationTarget.Broadcast) return true;
                if (notification.Target == NotificationTarget.Workshop) return true;
                return false;
            }
            if (notification.Action == NotificationAction.Ask) return false;
            if (notification.Action == NotificationAction.Start) return false;
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
            if (notification.Action == NotificationAction.Purchase) return false;
            if (notification.Action == NotificationAction.Enroll) return false;
            if (notification.Action == NotificationAction.Follow) return false;
            if (notification.Action == NotificationAction.Create)
            {
                if (notification.Target == NotificationTarget.Article) return false;
                if (notification.Target == NotificationTarget.Coaching) return false;
                if (notification.Target == NotificationTarget.Course) return false;
                if (notification.Target == NotificationTarget.Tutorial) return false;
                if (notification.Target == NotificationTarget.Broadcast) return false;
                if (notification.Target == NotificationTarget.Workshop) return false;
            }
            if (notification.Actors.Count > 1)
            {
                if (notification.Action == NotificationAction.Post && notification.Target == NotificationTarget.Post) return false;
                if (notification.Action == NotificationAction.Create) return false;
                if (notification.Action == NotificationAction.Ask) return false;
                if (notification.Action == NotificationAction.Start) return false;
            }
            return true;
        }

        private async Task<string> FormatActors(NotificationDto notification) {
            if (notification.Actors.Count == 0) return "";

            var textinfo = new CultureInfo("en-US", false).TextInfo;

            if (notification.Actors.Count == 1)
            {
                var actor = await this._usersRepository.FirstOrDefaultAsync(notification.Actors.ElementAt(0).UserId);
                return $"<span>{textinfo.ToTitleCase(actor.FullName)}</span>";
            }
            else if (notification.Actors.Count == 2)
            {
                var actor1 = await this._usersRepository.FirstOrDefaultAsync(notification.Actors.ElementAt(0).UserId);
                var actor2 = await this._usersRepository.FirstOrDefaultAsync(notification.Actors.ElementAt(1).UserId);
                return $"<span>{textinfo.ToTitleCase(actor1.FullName)}</span> and <span>{textinfo.ToTitleCase(actor2.FullName)}</span>";
            }
            else
            {
                var actor = await this._usersRepository.FirstOrDefaultAsync(notification.Actors.ElementAt(0).UserId);
                return $"<span>{textinfo.ToTitleCase(actor.FullName)}</span> and <span>{notification.Actors.Count - 1} others</span>";
            }
        }

        private async Task<string> FormatVerb(NotificationDto notification)
        {
            return await this.NotificationActionToText(notification.Action);
        }

        private async Task<string> FormatAdverb(NotificationDto notification)
        {
            if (notification.Action == NotificationAction.Purchase || notification.Action == NotificationAction.Enroll)
            {
                switch (notification.Target)
                {
                    case NotificationTarget.Broadcast:
                    case NotificationTarget.Workshop:
                        return "a ticket to";
                    case NotificationTarget.Course:
                        return "on";
                }
            }
            if (notification.Action == NotificationAction.Review) return "for";
            if (notification.Action == NotificationAction.Create) return "a new";
            if (notification.Action == NotificationAction.Ask) return "a";
            if (notification.Action == NotificationAction.Start) return "a";
            return null;
        }

        private async Task<string> FormatPronoun(NotificationDto notification)
        {
            switch(notification.Action)
            {
                case NotificationAction.Chat:
                    return "you a";
                case NotificationAction.Answer:
                case NotificationAction.Reply:
                case NotificationAction.Comment:
                    return await FormatCommentPronoun(notification);
                case NotificationAction.Like:
                case NotificationAction.React:
                    return await FormatReactionPronoun(notification);
                default:
                    return "your";
            }
        }

        private async Task<string> FormatCommentPronoun(NotificationDto notification)
        {
            // we need to look at the reference post/comment to determine who the owner of the reference is
            var post = await _postsRepository.GetAll()
                .Include(p => p.CreatorUser)
                .AsNoTracking()
                .Where(p => p.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            var comment = await _commentsRepository.GetAll()
                .Include(c => c.CreatorUser)
                .AsNoTracking()
                .Where(c => c.Id == notification.ReferenceId)
                .FirstOrDefaultAsync();

            var actorId = notification.Actors.ElementAt(0).UserId;
            var textInfo = new CultureInfo("en-US", false).TextInfo;

            if (post != null)
            {
                if (post.CreatorUserId == actorId) return "their";
                if (post.CreatorUserId == notification.UserId) return "your";
                return $"<span>{textInfo.ToTitleCase(post.CreatorUser.FullName)}'s</span>";
            }

            if (comment.CreatorUserId == actorId) return "their";
            if (comment.CreatorUserId == notification.UserId) return "your";
            return $"<span>{textInfo.ToTitleCase(comment.CreatorUser.FullName)}'s</span>";

        }

        private async Task<string> FormatReactionPronoun(NotificationDto notification)
        {
            // we need to look at the source post/comment to determine who the owner of the source is
            var sourceReferenceId = notification.Sources.Select(x => x.ReferenceId).FirstOrDefault();
            var post = await _postsRepository.GetAll()
                .Include(p => p.CreatorUser)
                .AsNoTracking()
                .Where(p => p.Id == sourceReferenceId)
                .FirstOrDefaultAsync();

            var comment = await _commentsRepository.GetAll()
                .Include(c => c.CreatorUser)
                .AsNoTracking()
                .Where(c => c.Id == sourceReferenceId)
                .FirstOrDefaultAsync();

            var actorId = notification.Actors.ElementAt(0).UserId;
            var textInfo = new CultureInfo("en-US", false).TextInfo;

            if (post != null)
            {
                if (post.CreatorUserId == actorId) return "their";
                if (post.CreatorUserId == notification.UserId) return "your";
                return $"<span>{textInfo.ToTitleCase(post.CreatorUser.FullName)}'s</span>";
            }
            
            if (comment.CreatorUserId == actorId) return "their";
            if (comment.CreatorUserId == notification.UserId) return "your";
            return $"<span>{textInfo.ToTitleCase(comment.CreatorUser.FullName)}'s</span>";
        }

        private async Task<string> FormatTarget(NotificationDto notification)
        {
            return await this.NotificationTargetToText(notification.Target, notification.Action);
        }

        private async Task<string> FormatLocation(NotificationReferencesDto references, NotificationDto notification)
        {
            var user = references.User;
            var service = references.Service;
            // The `referencePost` should always be the parent of a post.
            // `references.ParentPost` = a quick post where a comment is created
            // `references.Post` = a quick post
            var referencePost = references.ParentPost?.Parent ?? references.Post?.Parent; 
            string location = null;

            if (user != null)
            {
                if (user.Id == notification.UserId)
                {
                    location = "you";
                }
                else
                {
                    var textinfo = new CultureInfo("en-US", false).TextInfo;
                    location = $"<span>{textinfo.ToTitleCase(user.FullName)}</span>";
                }
            }
            else if (service != null)
            {
                location = $"<span>{service.Name}</span>";
            }
            else if (referencePost != null)
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

        private async Task<string> FormatObject(NotificationDto notification)
        {
            if (notification.Sources.Count() != 1) return null;

            var source = notification.Sources.FirstOrDefault();

            if (source == null) return null;

            var post = await this._postsRepository.GetAll()
               .Include(p => p.Parent)
               .Where(p => p.Id == source.ReferenceId)
               .FirstOrDefaultAsync();

            var comment = await this._commentsRepository.GetAll()
                .Include(p => p.Parent)
                .Where(p => p.Id == source.ReferenceId)
                .FirstOrDefaultAsync();

            string obj = null;
            if (post != null)
                obj = $"{post.Title ?? post.Content}";
            else if (comment != null)
                obj = $"{comment.Body}";
            return obj;
        }

    }
}
