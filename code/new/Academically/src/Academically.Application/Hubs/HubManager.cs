using Abp.Dependency;
using Abp.Domain.Repositories;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Chats.Dto;
using Academically.Services.Comments.Dto;
using Academically.Services.Posts.Dto;
using Academically.Services.Reactions.Dto;
using Academically.Services.UserTopics.Dto;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Channels;
using System.Threading.Tasks;
using Academically.Users.Dto;
using Academically.Services.Notifications.Dto;

namespace Academically.Hubs
{
    public interface IHubManager : ITransientDependency
    {
        Task NotifyUsersForPostCreated(PostDto post);
        Task NotifyUsersForPostUpdated(PostDto post);
        Task NotifyUsersForPostDeleted(PostDto post);
        Task NotifyUsersForCommentCreated(CommentDto comment);
        Task NotifyUsersForCommentUpdated(CommentDto comment);
        Task NotifyUsersForCommentDeleted(CommentDto comment);
        Task NotifyUsersForCommentReactionCreated(CommentReactionDto commentReaction);
        Task NotifyUsersForCommentReactionUpdated(CommentReactionDto commentReaction);
        Task NotifyUsersForCommentReactionDeleted(CommentReactionDto commentReaction);
        Task NotifyUsersForReactionCreated(ReactionDto reaction);
        Task NotifyUsersForReactionUpdated(ReactionDto reaction);
        Task NotifyUsersForReactionDeleted(ReactionDto reaction);
        Task NotifyUsersForUserTopicCreated(UserTopicDto userTopic);
        Task NotifyUsersForUserTopicUpdated(UserTopicDto userTopic);
        Task NotifyUsersForUserTopicDeleted(UserTopicDto userTopic);
        Task NotifyUsersForServiceCreated(object service, ServicesType type);
        Task NotifyUsersForServiceUpdated(object service, ServicesType type);
        Task NotifyUsersForServiceDeleted(Guid id);
        Task NotifyUsersForChannelMessageCreated(ChannelMessageDto message);
        Task NotifyUsersForChannelMessageUpdated(ChannelMessageDto message);
        Task NotifyUsersForChannelMessageDeleted(ChannelMessageDto message);
        Task NotifyUsersForChannelMemberTyping(ChannelDto channel);
        Task NotifyUsersForChannelArchive(ChannelDto channel);
        Task NotifyUsersForChannelUnarchive(ChannelDto channel);
        Task NotifyUsersForNewUserActivities(UserStatusLogDto statusLog);
        Task NotifyUsersForNewNotification(NotificationDto notification);
        Task NotifyUsersForUpdatedNotification(NotificationDto notification);
        Task NotifyUsersForDeletedNotification(NotificationDto notification);
    }

    public class HubManager : IHubManager
    {
        private const string FollowingGroup = "following-group";
        private const string ReactionsGroup = "reactions-group";
        private const string UserTopicsGroup = "user-topics-group";
        private const string AllChannels = "ch-all";
        private const string AllMsgChannels = "ch-msg-all";
        private const string AllUserStatusLogs = "user-status-logs";
        private const string AllNotifications = "notif-all";

        private readonly IHubContext<UserTopicsHub> _userTopicsHub;
        private readonly IHubContext<PostsHub> _postsHub;
        private readonly IHubContext<CommentsHub> _commentsHub;
        private readonly IHubContext<ServicesHub> _servicesHub;
        private readonly IHubContext<ReactionsHub> _reactionsHub;
        private readonly IHubContext<ChannelsHub> _channelsHub;
        private readonly IHubContext<ChannelMessagesHub> _channelMessagesHub;
        private readonly IHubContext<NewUserStatusLogHub> _newUserLoggedInHub;
        private readonly IHubContext<NotificationsHub> _notificationsHub;
        private readonly IRepository<Post, Guid> _postRepository;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<Reaction, Guid> _reactionsRepository;

        public HubManager(IHubContext<UserTopicsHub> userTopicsHub,
            IHubContext<PostsHub> postsHub,
            IHubContext<CommentsHub> commentsHub,
            IHubContext<ServicesHub> servicesHub,
            IHubContext<ReactionsHub> reactionsHub,
            IHubContext<ChannelsHub> channelsHub,
            IHubContext<ChannelMessagesHub> channelMessagesHub,
            IHubContext<NewUserStatusLogHub> newUserLoggedInHub,
            IHubContext<NotificationsHub> notificationsHub,
            IRepository<Post, Guid> postRepository,
            IRepository<Comment, Guid> commentsRepository,
            IRepository<Reaction, Guid> reactionsRepository)
        {
            _userTopicsHub = userTopicsHub;
            _postsHub = postsHub;
            _commentsHub = commentsHub;
            _servicesHub = servicesHub;
            _reactionsHub = reactionsHub;
            _channelsHub = channelsHub;
            _channelMessagesHub = channelMessagesHub;
            _notificationsHub = notificationsHub;
            _postRepository = postRepository;
            _commentsRepository = commentsRepository;
            _reactionsRepository = reactionsRepository;
            _newUserLoggedInHub = newUserLoggedInHub;
        }

        public async Task NotifyUsersForPostCreated(PostDto post)
        {
            if (post.ParentId.HasValue)
            {
                await _postsHub.Clients.Group(post.ParentId.ToString()).SendAsync(nameof(HubEvent.PostCreated), post);
            }
            else
            {
                await _postsHub.Clients.Group(FollowingGroup).SendAsync(nameof(HubEvent.PostCreated), post);
            }
        }

        public async Task NotifyUsersForPostUpdated(PostDto post)
        {
            if (post.ParentId.HasValue)
            {
                await _postsHub.Clients.Group(post.ParentId.ToString()).SendAsync(nameof(HubEvent.PostUpdated), post);
            }
            else
            {
                await _postsHub.Clients.Group(FollowingGroup).SendAsync(nameof(HubEvent.PostUpdated), post);
            }
        }

        public async Task NotifyUsersForPostDeleted(PostDto post)
        {
            if (post.ParentId.HasValue)
            {
                await _postsHub.Clients.Group(post.ParentId.ToString()).SendAsync(nameof(HubEvent.PostDeleted), post.Id);
            }
            else
            {
                await _postsHub.Clients.Group(FollowingGroup).SendAsync(nameof(HubEvent.PostDeleted), post.Id);
            }
        }

        public async Task NotifyUsersForCommentCreated(CommentDto comment)
        {
            if (comment.ParentId.HasValue)
            {
                await _commentsHub.Clients.Group($"{comment.ReferenceId}-{comment.ParentId}").SendAsync(nameof(HubEvent.CommentCreated), comment);
            }
            else
            {
                await _commentsHub.Clients.Group(comment.ReferenceId).SendAsync(nameof(HubEvent.CommentCreated), comment);
            }
        }

        public async Task NotifyUsersForCommentUpdated(CommentDto comment)
        {
            if (comment.ParentId.HasValue)
            {
                await _commentsHub.Clients.Group($"{comment.ReferenceId}-{comment.ParentId}").SendAsync(nameof(HubEvent.CommentUpdated), comment);
            }
            else
            {
                await _commentsHub.Clients.Group(comment.ReferenceId).SendAsync(nameof(HubEvent.CommentUpdated), comment);
            }
        }

        public async Task NotifyUsersForCommentDeleted(CommentDto comment)
        {
            if (comment.ParentId.HasValue)
            {
                await _commentsHub.Clients.Group($"{comment.ReferenceId}-{comment.ParentId}").SendAsync(nameof(HubEvent.CommentDeleted), comment.Id);
            }
            else
            {
                await _commentsHub.Clients.Group(comment.ReferenceId).SendAsync(nameof(HubEvent.CommentDeleted), comment.Id);
            }
        }

        public async Task NotifyUsersForCommentReactionCreated(CommentReactionDto commentReaction)
        {

            var comment = await _commentsRepository.GetAsync(commentReaction.CommentId);

            if (comment.ParentId.HasValue)
            {
                await _commentsHub.Clients.Group($"{comment.ReferenceId}-{comment.ParentId}").SendAsync(nameof(HubEvent.CommentReactionCreated), commentReaction);
            }
            else
            {
                await _commentsHub.Clients.Group(comment.ReferenceId).SendAsync(nameof(HubEvent.CommentReactionCreated), commentReaction);
            }
        }

        public async Task NotifyUsersForCommentReactionUpdated(CommentReactionDto commentReaction)
        {
            var comment = await _commentsRepository.GetAsync(commentReaction.CommentId);

            if (comment.ParentId.HasValue)
            {
                await _commentsHub.Clients.Group($"{comment.ReferenceId}-{comment.ParentId}").SendAsync(nameof(HubEvent.CommentReactionUpdated), commentReaction);
            }
            else
            {
                await _commentsHub.Clients.Group(comment.ReferenceId).SendAsync(nameof(HubEvent.CommentReactionUpdated), commentReaction);
            }
        }

        public async Task NotifyUsersForCommentReactionDeleted(CommentReactionDto commentReaction)
        {
            var comment = await _commentsRepository.GetAsync(commentReaction.CommentId);

            if (comment.ParentId.HasValue)
            {
                await _commentsHub.Clients.Group($"{comment.ReferenceId}-{comment.ParentId}").SendAsync(nameof(HubEvent.CommentReactionDeleted), commentReaction.Id);
            }
            else
            {
                await _commentsHub.Clients.Group(comment.ReferenceId).SendAsync(nameof(HubEvent.CommentReactionDeleted), commentReaction.Id);
            }
        }

        public async Task NotifyUsersForReactionCreated(ReactionDto reaction)
        {
            if (reaction.ReferenceId != null)
            {
                await _reactionsHub.Clients.Group($"{reaction.ReferenceId}").SendAsync(nameof(HubEvent.ReactionCreated), reaction);
            } else
            {
                await _reactionsHub.Clients.Group(ReactionsGroup).SendAsync(nameof(HubEvent.ReactionCreated), reaction);
            }
            
        }

        public async Task NotifyUsersForReactionUpdated(ReactionDto reaction)
        {
            if (reaction.ReferenceId != null)
            {
                await _reactionsHub.Clients.Group($"{reaction.ReferenceId}").SendAsync(nameof(HubEvent.ReactionUpdated), reaction);
            }
            else
            {
                await _reactionsHub.Clients.Group(ReactionsGroup).SendAsync(nameof(HubEvent.ReactionUpdated), reaction);
            }
        }

        public async Task NotifyUsersForReactionDeleted(ReactionDto reaction)
        {
            if (reaction.ReferenceId != null)
            {
                await _reactionsHub.Clients.Group($"{reaction.ReferenceId}").SendAsync(nameof(HubEvent.ReactionDeleted), reaction);
            }
            else
            {
                await _reactionsHub.Clients.Group(ReactionsGroup).SendAsync(nameof(HubEvent.ReactionDeleted), reaction);
            }
        }

        public async Task NotifyUsersForUserTopicCreated(UserTopicDto userTopic)
        {
            if (userTopic.UserId != null)
            {
                await _userTopicsHub.Clients.Group($"{userTopic.UserId}").SendAsync(nameof(HubEvent.UserTopicCreated), userTopic);
            }
            else
            {
                await _userTopicsHub.Clients.Group(UserTopicsGroup).SendAsync(nameof(HubEvent.UserTopicCreated), userTopic);
            }
        }

        public async Task NotifyUsersForUserTopicUpdated(UserTopicDto userTopic)
        {
            if (userTopic.UserId != null)
            {
                await _userTopicsHub.Clients.Group($"{userTopic.UserId}").SendAsync(nameof(HubEvent.UserTopicUpdated), userTopic);
            }
            else
            {
                await _userTopicsHub.Clients.Group(UserTopicsGroup).SendAsync(nameof(HubEvent.UserTopicUpdated), userTopic);
            }
        }

        public async Task NotifyUsersForUserTopicDeleted(UserTopicDto userTopic)
        {
            if (userTopic.UserId != null)
            {
                await _userTopicsHub.Clients.Group($"{userTopic.UserId}").SendAsync(nameof(HubEvent.UserTopicDeleted), userTopic);
            }
            else
            {
                await _userTopicsHub.Clients.Group(UserTopicsGroup).SendAsync(nameof(HubEvent.UserTopicDeleted), userTopic);
            }
        }

        public async Task NotifyUsersForServiceCreated(object service, ServicesType type)
        {
            await _servicesHub.Clients.All.SendAsync(nameof(HubEvent.ServiceCreated), service, type);
        }

        public async Task NotifyUsersForServiceUpdated(object service, ServicesType type)
        {
            await _servicesHub.Clients.All.SendAsync(nameof(HubEvent.ServiceUpdated), service, type);
        }

        public async Task NotifyUsersForServiceDeleted(Guid id)
        {
            await _servicesHub.Clients.All.SendAsync(nameof(HubEvent.ServiceDeleted), id);
        }

        public async Task NotifyUsersForChannelMessageCreated(ChannelMessageDto message)
        {
            await _channelsHub.Clients.Group(AllChannels).SendAsync(nameof(HubEvent.ChannelMessageCreated), message);
            await _channelMessagesHub.Clients.Group($"ch-msg-{message.ChannelId}").SendAsync(nameof(HubEvent.ChannelMessageCreated), message);
        }

        public async Task NotifyUsersForChannelMessageUpdated(ChannelMessageDto message)
        {
            await _channelsHub.Clients.Group(AllChannels).SendAsync(nameof(HubEvent.ChannelMessageUpdated), message);
            await _channelMessagesHub.Clients.Group($"ch-msg-{message.ChannelId}").SendAsync(nameof(HubEvent.ChannelMessageUpdated), message);
        }

        public async Task NotifyUsersForChannelMessageDeleted(ChannelMessageDto message)
        {
            await _channelsHub.Clients.Group(AllChannels).SendAsync(nameof(HubEvent.ChannelMessageDeleted), message);
            await _channelMessagesHub.Clients.Group($"ch-msg-{message.ChannelId}").SendAsync(nameof(HubEvent.ChannelMessageDeleted), message);
        }

        public async Task NotifyUsersForChannelMemberTyping(ChannelDto channel)
        {
            await _channelsHub.Clients.Group(AllChannels).SendAsync(nameof(HubEvent.ChannelMemberTyping), channel);
            await _channelsHub.Clients.Group($"ch-{channel.Id}").SendAsync(nameof(HubEvent.ChannelMemberTyping), channel);
        }

        public async Task NotifyUsersForChannelArchive(ChannelDto channel)
        {
            await _channelsHub.Clients.Group(AllChannels).SendAsync(nameof(HubEvent.ChannelArchive), channel);
            await _channelsHub.Clients.Group($"ch-{channel.Id}").SendAsync(nameof(HubEvent.ChannelArchive), channel);
        }

        public async Task NotifyUsersForChannelUnarchive(ChannelDto channel)
        {
            await _channelsHub.Clients.Group(AllChannels).SendAsync(nameof(HubEvent.ChannelUnarchive), channel);
            await _channelsHub.Clients.Group($"ch-{channel.Id}").SendAsync(nameof(HubEvent.ChannelUnarchive), channel);
        }
        
        public async Task NotifyUsersForNewUserActivities(UserStatusLogDto statusLog)
        {
            await _newUserLoggedInHub.Clients.Group(AllUserStatusLogs).SendAsync(nameof(HubEvent.NewUserLoggedIn), statusLog);
            await _newUserLoggedInHub.Clients.Group($"user-{statusLog.CreatorUserId}").SendAsync(nameof(HubEvent.NewUserLoggedIn), statusLog);
        }

        public async Task NotifyUsersForNewNotification(NotificationDto notification)
        {
            await _notificationsHub.Clients.Group($"notif-{notification.UserId}").SendAsync(nameof(HubEvent.NotificationCreated), notification);
        }

        public async Task NotifyUsersForUpdatedNotification(NotificationDto notification)
        {
            await _notificationsHub.Clients.Group($"notif-{notification.UserId}").SendAsync(nameof(HubEvent.NotificationUpdated), notification);
        }

        public async Task NotifyUsersForDeletedNotification(NotificationDto notification)
        {
            await _notificationsHub.Clients.Group($"notif-{notification.UserId}").SendAsync(nameof(HubEvent.NotificationDeleted), notification);
        }
    }
}
