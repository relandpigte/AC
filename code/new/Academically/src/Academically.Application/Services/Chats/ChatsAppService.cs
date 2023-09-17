using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Chats.Dto;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Channel = Academically.Domain.Entities.Channel;
using Academically.Hubs;
using Microsoft.AspNetCore.SignalR;
using Abp.Timing;
using Academically.Domain.Services.Documents;
using Academically.Authorization.Users;
using Academically.Users.Dto;
using System.Text.RegularExpressions;
using Academically.Domain.Enums;
using Academically.Services.Articles;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings;
using Academically.Services.Coachings.Dto;
using Academically.Services.Courses;
using Academically.Services.Courses.Dto;
using Academically.Services.Events;
using Academically.Services.Events.Dto;
using Academically.Services.Videos;
using Academically.Services.Videos.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using System.IO.Compression;
using System.Linq.Dynamic.Core;

namespace Academically.Services.Chats
{
    public class ChatsAppService : AcademicallyAppServiceBase, IChatsAppService
    {
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<Channel, Guid> _channelRepository;
        private readonly IRepository<ChannelMessage, Guid> _channelMessageRepository;
        private readonly IRepository<ChannelMember, Guid> _channelMemberRepository;
        private readonly IRepository<ChannelArchive, Guid> _channelArchiveRepository;
        private readonly IRepository<ChannelMessageAttachment, Guid> _channelMessageAttachmentRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IHubContext<ChannelsHub> _channelsHub;
        private readonly IRepository<ChannelNotification, Guid> _channelNotificationRepository;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Video, Guid> _videoRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<UserBlocking, Guid> _userBlockingRepository;

        public ChatsAppService(
            IDocumentsDomainService documentsDomainService,
            IRepository<Channel, Guid> channelRepository,
            IRepository<ChannelMessage, Guid> channelMessageRepository,
            IRepository<ChannelMember, Guid> channelMemberRepository,
            IRepository<ChannelArchive, Guid> channelArchiveRepository,
            IRepository<ChannelMessageAttachment, Guid> channelMessageAttachmentRepository,
            IRepository<User, long> userRepository,
            IHubContext<ChannelsHub> channelsHub,
            IRepository<ChannelNotification, Guid> channelNotificationRepository,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Course, Guid> coursesRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Video, Guid> videoRepository,
            IRepository<Event, Guid> eventRepository,
            IRepository<UserBlocking, Guid> userBlockingRepository
        )
        {
            _documentsDomainService = documentsDomainService;
            _channelRepository = channelRepository;
            _channelMessageRepository = channelMessageRepository;
            _channelMemberRepository = channelMemberRepository;
            _channelArchiveRepository = channelArchiveRepository;
            _channelMessageAttachmentRepository = channelMessageAttachmentRepository;
            _userRepository = userRepository;
            _channelsHub = channelsHub;
            _channelNotificationRepository = channelNotificationRepository;
            _articlesRepository = articlesRepository;
            _coursesRepository = coursesRepository;
            _coachingRepository = coachingRepository;
            _videoRepository = videoRepository;
            _eventRepository = eventRepository;
            _userBlockingRepository = userBlockingRepository;
        }

        public async Task<bool> ArchiveChannel(Guid channelId)
        {
            var channel = await this._channelRepository.GetAsync(channelId);
            if (channel == null) return false;
            await this._channelArchiveRepository.InsertAsync(new ChannelArchive { ChannelId = channelId });
            return true;
        }

        public async Task<ChannelMessageDto> CreateChannelMessage([FromForm] CreateChannelMessageInputDto input)
        {
            var message = new ChannelMessage();
            var currentUser = await GetCurrentUserAsync();
            
            if (input.ChannelId.HasValue)
            {
                var existingChannel = await this._channelRepository.GetAsync(input.ChannelId.Value);
                message.ChannelId = existingChannel.Id;
            }
            else
            {
                var channel = await this._channelRepository.InsertAsync(new Channel());
                await CurrentUnitOfWork.SaveChangesAsync();
                await this._channelMemberRepository.InsertAsync(new ChannelMember
                {
                    ChannelId = channel.Id,
                    UserId = currentUser.Id
                });

                await this._channelMemberRepository.InsertAsync(new ChannelMember
                {
                    ChannelId = channel.Id,
                    UserId = input.RecipientUserId
                });
                message.ChannelId = channel.Id;
            }
            
            message.Message = input.Message;
            message.ParentId = input.ParentId;
            message.ServiceId = input.ServiceId;
            message.ServiceType = input.ServiceType;

            var result = await this._channelMessageRepository.InsertAsync(message);

            if (input.Attachments == null || !input.Attachments.Any())
                return result == null ? null : ObjectMapper.Map<ChannelMessageDto>(result);

            if (input.Attachments == null || !input.Attachments.Any())
                return result == null ? null : ObjectMapper.Map<ChannelMessageDto>(result);
            
            var fileExtensionList = input.Attachments.Select(a => Path.GetExtension(a.FileName).Substring((1))).ToList();
            foreach (var f in fileExtensionList)
            {
                var isValidExtension = Enum.IsDefined(typeof(AttachmentType), f.ToLower());
                if (!isValidExtension)
                {
                    throw new InvalidOperationException("Invalid File Extension!");
                }
            }

            var userId = AbpSession.UserId.Value;
            foreach (var attachment in input.Attachments)
            {
                var document = await _documentsDomainService.CreateAsync(userId, attachment, DocumentType.PostAttachment);
                await _channelMessageAttachmentRepository.InsertAsync(new ChannelMessageAttachment
                {
                    ChannelMessageId = result.Id,
                    DocumentId = document.Id,
                });
            }

            return result == null ? null : ObjectMapper.Map<ChannelMessageDto>(result);
        }

        public async Task<bool> DeleteChannel(Guid channelId)
        {
            var channel = await this._channelRepository.GetAsync(channelId);
            if (channel == null) return false;
            channel.IsDeleted = true;
            return true;
        }

        public async Task<List<ChannelDto>> GetAllArchivedChannelsForUser(long? userId)
        {
            var channels = await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                        .ThenInclude(m => m.User)
                    .Include(c => c.Messages)
                    .Include(c => c.Archives)
                    .Where(c => !c.IsDeleted)
                    .Where(c => c.Members.Any(m => m.UserId == userId))
                    .Where(c => c.Archives.Any(a => a.CreatorUserId == userId))
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .ToListAsync();

            foreach (var channel in channels)
            {
                foreach (var member in channel.Members)
                {
                    if (member.User.ProfilePictureDocumentId.HasValue)
                        member.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(member.User.ProfilePictureDocumentId.Value);
                }

                foreach (var message in channel.Messages)
                {
                    foreach (var attachment in message.ChannelMessageAttachments)
                    {
                        attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);
                    }
                }
                await GetBlockedUsers(channel);
            }

            return channels;
        }

        public async Task<List<ChannelMemberDto>> GetAllChannelMembers(Guid channelId)
        {
            return await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                        .ThenInclude(m => m.User)
                    .Include(c => c.Members)
                        .ThenInclude(m => m.Channel)
                    .Where(c => c.Id == channelId)
                    .SelectMany(c => c.Members)
                    .Select(m => ObjectMapper.Map<ChannelMemberDto>(m))
                    .ToListAsync();
        }

        public async Task<List<ChannelMessageDto>> GetAllChannelMessages(Guid channelId)
        {
            var messages = await this._channelRepository.GetAll()
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Channel)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Parent)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.CreatorUser)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.ChannelMessageAttachments)
                            .ThenInclude(a => a.Document)
                    .Where(c => c.Id == channelId)
                    .SelectMany(c => c.Messages)
                    .Select(m => ObjectMapper.Map<ChannelMessageDto>(m))
                    .ToListAsync();

            foreach (var message in messages)
            {
                if (message.CreatorUser.ProfilePictureDocumentId.HasValue)
                    message.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(message.CreatorUser.ProfilePictureDocumentId.Value);

                foreach (var attachment in message.ChannelMessageAttachments)
                {
                    attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);
                }
                await FillInService(message);
            }

            return messages;
        }

        public async Task<List<ChannelDto>> GetAllChannelsForUser(long? userId)
        {
            return await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                        .ThenInclude(m => m.User)
                    .Include(c => c.Messages)
                    .Include(c => c.ChannelNotifications)
                    .Where(c => !c.IsDeleted)
                    .Where(c => c.Members.Any(m => m.UserId == userId))
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .ToListAsync();
        }

        public async Task<List<ChannelDto>> GetAllInboxChannelsForUser(long? userId)
        {
            var currentUser = await GetCurrentUserAsync();
            var channels = await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                        .ThenInclude(m => m.User)
                    .Include(c => c.Messages)
                    .Include(c => c.Archives)
                    .Include(c => c.ChannelNotifications)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.ChannelMessageAttachments)
                            .ThenInclude(a => a.Document)
                    .Where(c => !c.IsDeleted)
                    .Where(c => c.Members.Any(m => m.UserId == userId))
                    .Where(c => !c.Archives.Any(a => a.CreatorUserId == userId))
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .ToListAsync();

            foreach (var channel in channels)
            {
                foreach (var member in channel.Members)
                {
                    if (member.User.ProfilePictureDocumentId.HasValue)
                        member.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(member.User.ProfilePictureDocumentId.Value);
                }

                foreach (var message in channel.Messages)
                {
                    await FillInService(message);
                    foreach (var attachment in message.ChannelMessageAttachments)
                    {
                        attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);
                    }
                }
                await GetBlockedUsers(channel);
            }

            return channels;
        }

        public async Task<ChannelDto> GetChannel(Guid channelId)
        {
            var channel = await this._channelRepository.GetAll()
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Parent)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.CreatorUser)
                    .Include(c => c.Members)
                        .ThenInclude(m => m.User)
                    .Where(c => c.Id == channelId)
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .SingleOrDefaultAsync();

            foreach (var member in channel.Members)
            {
                if (member.User.ProfilePictureDocumentId.HasValue)
                    member.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(member.User.ProfilePictureDocumentId.Value);
            }
            
            await GetBlockedUsers(channel);
            return channel;
        }

        public async Task<ChannelMemberDto> GetChannelMember(Guid channelMemberId)
        {
            return await this._channelMemberRepository.GetAll()
                     .Include(m => m.User)
                     .Include(m => m.Channel)
                     .Where(m => m.Id == channelMemberId)
                     .Select(m => ObjectMapper.Map<ChannelMemberDto>(m))
                     .SingleOrDefaultAsync();
        }

        public async Task<ChannelMessageDto> GetChannelMessage(Guid channelMessageId)
        {
            var message = await this._channelMessageRepository.GetAll()
                    .Include(m => m.Channel)
                    .Include(m => m.Parent)
                        .ThenInclude(p => p.CreatorUser)
                    .Include(m => m.CreatorUser)
                    .Where(m => m.Id == channelMessageId)
                    .Select(m => ObjectMapper.Map<ChannelMessageDto>(m))
                    .SingleOrDefaultAsync();

            if (message?.CreatorUser?.ProfilePictureDocumentId.HasValue ?? false)
            {
                message.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(message.CreatorUser.ProfilePictureDocumentId.Value);
            }
            
            await FillInService(message);
            return message;
        }

        public async Task<bool> ReportTyping(Guid channelId)
        {
            return true;
        }

        public async Task<bool> UnarchiveChannel(Guid channelId)
        {
            var channel = await this._channelRepository.GetAsync(channelId);
            if (channel == null) return false;
            var archive = await this._channelArchiveRepository.GetAll()
                .Where(a => a.ChannelId == channelId)
                .FirstOrDefaultAsync();
            if (archive != null) await this._channelArchiveRepository.DeleteAsync(archive.Id);
            return true;
        }

        public async Task<ChannelMessageDto> UpdateChannelMessage(UpdateChannelMessageInputDto input)
        {
            var message = await this._channelMessageRepository.FirstOrDefaultAsync(input.ChannelMessageId);
            if (message == null) return null;
            message.Message = input.Message;
            return ObjectMapper.Map<ChannelMessageDto>(message);
        }

        public async Task<bool> SeenChannelMessages(Guid channelId,DateTime targetMessagesDateTime)
        {
            var currentUser = await GetCurrentUserAsync();
            var messages = await this._channelMessageRepository.GetAll()
                    .Where(m => m.ChannelId == channelId)
                    .Where(m => m.CreatorUserId != currentUser.Id)
                    .Where(m => m.IsSeen == null)
                    .Where(m => m.CreationTime <= targetMessagesDateTime)
                    .ToListAsync();

            messages?.ForEach(m => m.IsSeen = Clock.Now);
            return true;
        }

        public async Task<bool> SetChannelMemberTyping(Guid channelId, bool isTyping)
        {
            var currentUser = await GetCurrentUserAsync();
            var messages = await this._channelMemberRepository.GetAll()
                    .Where(m => m.ChannelId == channelId)
                    .Where(m => m.UserId == currentUser.Id)
                    .ToListAsync();

            messages?.ForEach(m => m.IsTyping = isTyping);
            return true;
        }
        
        public async Task CreateChannelNotification(Guid channelId)
        {
            await _channelNotificationRepository.InsertAsync(new ChannelNotification { ChannelId = channelId });
        }

        public async Task DeleteChannelNotification(Guid channelId)
        {
            var currentUser = await GetCurrentUserAsync();
            await _channelNotificationRepository
                .DeleteAsync(c => c.ChannelId == channelId && c.CreatorUserId == currentUser.Id);
        }

        public async Task<SearchByKeywordResponseDto> SearchByKeyword(string keyword)
        {
            var searchResults = new SearchByKeywordResponseDto();

            Regex.Replace(keyword, @"\s+", "");

            var messages = await this._channelMessageRepository.GetAll()
                .Include(m => m.Channel)
                .Include(m => m.CreatorUser)
                .Where(m => m.Message.ToLower().Contains(keyword.ToLower()))
                .Select(u => ObjectMapper.Map<ChannelMessageDto>(u))
                .ToListAsync();

            foreach (var message in messages)
            {
                message.Channel = await this.GetChannel(message.ChannelId);
            }

            var matchedChannels = (from m in messages
                                  group m by m.Channel.Id into mg
                                  select new MatchedChannelDto()
                                  {
                                      Keyword = keyword,
                                      Channel = new ChannelDto()
                                      {
                                          Id = mg.First().Channel.Id,
                                          Name = mg.First().Channel.Name,
                                          IsArchive = mg.First().Channel.IsArchive,
                                          IsActive = mg.First().Channel.IsActive,
                                          IsDeleted = mg.First().Channel.IsDeleted,
                                          CreationTime = mg.First().Channel.CreationTime,
                                          CreatorUserId = mg.First().Channel.CreatorUserId,
                                          CreatorUser = mg.First().Channel.CreatorUser,
                                          LastModificationTime = mg.First().Channel.LastModificationTime,
                                          LastModifierUserId = mg.First().Channel.LastModifierUserId,
                                          Messages = mg.ToList(),
                                          Members = mg.First().Channel.Members
                                      },
                                      MatchCount = mg.Sum(m => Regex.Matches(m.Message, @"(" + keyword.ToLower() + ")", RegexOptions.IgnoreCase).Count)
                                  }).ToList();

            searchResults.Keyword = keyword;
            searchResults.Channels = matchedChannels;

            var channelIds = matchedChannels.Select(c => c.Channel.Id).ToList();
            var users = await this._channelMemberRepository.GetAll()
                .Include(m => m.User)
                .Where(m => channelIds.Contains(m.ChannelId))
                .Select(m => ObjectMapper.Map<UserDto>(m.User))
                .ToListAsync();

            foreach (var user in users)
            {
                if (user.ProfilePictureDocumentId.HasValue)
                    user.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(user.ProfilePictureDocumentId.Value);
            }

            searchResults.Users = users;

            return searchResults;
        }

        private async Task GetBlockedUsers(ChannelDto channel)
        {
            if (channel == null) return;
            
            channel.BlockedUsers = await _userBlockingRepository.GetAll()
                .Include(u => u.CreatorUser)
                .Include(u => u.BlockedUser)
                .Where(u => u.CreatorUserId == AbpSession.UserId.Value)
                .ToListAsync();
                
            channel.BlockedByUsers =  await _userBlockingRepository.GetAll()
                .Include(u => u.CreatorUser)
                .Include(u => u.BlockedUser)
                .Where(u => u.BlockedUserId == AbpSession.UserId.Value)
                .ToListAsync();
        }
        
        private async Task FillInService(ChannelMessageDto message)
        {
            if (message?.ServiceId == null) return;

            switch (message.ServiceType)
            {
                case ServicesType.Event:
                case ServicesType.Workshop:
                    var event_ = await _eventRepository.GetAsync(message.ServiceId.Value);
                    message.Event = ObjectMapper.Map<EventDto>(event_);
                    if (message.Event.ThumbnailDocumentId.HasValue)
                        message.Event.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(message.Event.ThumbnailDocumentId.Value);
                    break;
                case ServicesType.Course:
                    var course = await _coursesRepository.GetAsync(message.ServiceId.Value);
                    message.Course = ObjectMapper.Map<CourseDto>(course);
                    if (message.Course.ImageDocumentId.HasValue)
                        message.Course.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                    break;
                case ServicesType.Tutorial:
                    var video = await _videoRepository.GetAsync(message.ServiceId.Value);
                    message.Video = ObjectMapper.Map<VideoDto>(video);
                    if (message.Video.ThumbnailDocumentId.HasValue)
                        message.Video.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(message.Video.ThumbnailDocumentId.Value);
                    break;
                case ServicesType.Article:
                    var article = await _articlesRepository.GetAsync(message.ServiceId.Value);
                    message.Article = ObjectMapper.Map<ArticleDto>(article);
                    if (message.Article.ThumbnailDocumentId.HasValue)
                        message.Article.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(message.Article.ThumbnailDocumentId.Value);
                    break;
                case ServicesType.Coaching:
                    var coaching = await _coachingRepository.GetAsync(message.ServiceId.Value);
                    message.Coaching = ObjectMapper.Map<CoachingDto>(coaching);
                    if (message.Coaching.ThumbnailDocumentId.HasValue)
                        message.Coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                    break;
            }
        }

    }
}
