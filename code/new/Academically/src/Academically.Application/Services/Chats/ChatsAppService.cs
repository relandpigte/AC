using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Academically.Domain.Entities;
using Academically.Services.Chats.Dto;
using Academically.Services.Posts.Dto;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Threading.Channels;
using Channel = Academically.Domain.Entities.Channel;
using Academically.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Academically.Services.Chats
{
    public class ChatsAppService : AcademicallyAppServiceBase, IChatsAppService
    {
        private readonly IRepository<Channel, Guid> _channelRepository;
        private readonly IRepository<ChannelMessage, Guid> _channelMessageRepository;
        private readonly IRepository<ChannelMember, Guid> _channelMemberRepository;
        private readonly IHubContext<ChannelsHub> _channelsHub;

        public ChatsAppService(
            IRepository<Channel, Guid> channelRepository,
            IRepository<ChannelMessage, Guid> channelMessageRepository,
            IRepository<ChannelMember, Guid> channelMemberRepository,
            IHubContext<ChannelsHub> channelsHub
        )
        {
            this._channelRepository = channelRepository;
            this._channelMessageRepository = channelMessageRepository;
            this._channelMemberRepository = channelMemberRepository;
            this._channelsHub = channelsHub;
        }

        public async Task<bool> ArchiveChannel(Guid channelId)
        {
            var channel = await this._channelRepository.GetAsync(channelId);
            if (channel == null) return false;
            channel.IsArchive = true;
            return true;
        }

        public async Task<ChannelMessageDto> CreateChannelMessage(CreateChannelMessageInputDto input)
        {
            var message = new ChannelMessage();

            if (input.ChannelId.HasValue)
            {
                var existingChannel = await this._channelRepository.GetAsync(input.ChannelId.Value);
                if (existingChannel == null) existingChannel = await this.PrepareChannel(input.RecipientUserId);
                message.ChannelId = existingChannel.Id;
            }
            else
            {
                var existingChannel = await this.PrepareChannel(input.RecipientUserId);
                message.ChannelId = existingChannel.Id;
            }
            
            message.Message = input.Message;

            var result = await this._channelMessageRepository.InsertAsync(message);

            if (result == null) return null;
            else return ObjectMapper.Map<ChannelMessageDto>(result);
        }

        private async Task<Channel> PrepareChannel(long recipientUserId, string channelName = "")
        {
            var channel = await this.CreateChannel(channelName);
            await this.CreateChannelMembers(channel.Id, recipientUserId);
            return channel;
        }

        [UnitOfWork]
        private async Task<Channel> CreateChannel(string channelName = "")
        {
            var channel = new Channel();
            channel.Name = channelName;
            return await this._channelRepository.InsertAsync(channel);
        }

        [UnitOfWork]
        private async Task CreateChannelMembers(Guid channelId, long recipientUserId)
        {
            var currentUser = await GetCurrentUserAsync();
            await this._channelMemberRepository.InsertAsync(new ChannelMember
            {
                ChannelId = channelId,
                UserId = currentUser.Id
            });

            await this._channelMemberRepository.InsertAsync(new ChannelMember
            {
                ChannelId = channelId,
                UserId = recipientUserId
            });
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
            return await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                    .Include(c => c.CreatorUser)
                    .Where(c => c.IsArchive == true)
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .ToListAsync();
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
            return await this._channelRepository.GetAll()
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Channel)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Parent)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.CreatorUser)
                    .Where(c => c.Id == channelId)
                    .SelectMany(c => c.Messages)
                    .Select(m => ObjectMapper.Map<ChannelMessageDto>(m))
                    .ToListAsync();
        }

        public async Task<List<ChannelDto>> GetAllChannelsForUser(long? userId)
        {
            return await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                    .Where(c => c.Members.Any(m => m.UserId == userId))
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .ToListAsync();
        }

        public async Task<List<ChannelDto>> GetAllInboxChannelsForUser(long? userId)
        {
            return await this._channelRepository.GetAll()
                    .Include(c => c.Members)
                    .Include(c => c.CreatorUser)
                    .Where(c => c.IsArchive == false)
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .ToListAsync();
        }

        public async Task<ChannelDto> GetChannel(Guid channelId)
        {
            return await this._channelRepository.GetAll()
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Channel)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Parent)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.CreatorUser)
                    .Include(c => c.Members)
                        .ThenInclude(m => m.User)
                    .Include(c => c.Members)
                        .ThenInclude(m => m.Channel)
                    .Where(c => c.Id == channelId)
                    .Select(c => ObjectMapper.Map<ChannelDto>(c))
                    .SingleOrDefaultAsync();
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
            return await this._channelMessageRepository.GetAll()
                    .Include(m => m.Channel)
                    .Include(m => m.Parent)
                    .Include(m => m.CreatorUser)
                    .Where(m => m.Id == channelMessageId)
                    .Select(m => ObjectMapper.Map<ChannelMessageDto>(m))
                    .SingleOrDefaultAsync();
        }

        public async Task<bool> ReportTyping(Guid channelId)
        {
            return true;
        }

        public async Task<bool> UnarchiveChannel(Guid channelId)
        {
            var channel = await this._channelRepository.GetAsync(channelId);
            if (channel == null) return false;
            channel.IsArchive = false;
            return true;
        }

        public async Task<ChannelMessageDto> UpdateChannelMessage(UpdateChannelMessageInputDto input)
        {
            var message = await this._channelMessageRepository.FirstOrDefaultAsync(input.ChannelMessageId);
            if (message == null) return null;
            message.Message = input.Message;
            return ObjectMapper.Map<ChannelMessageDto>(message);
        }
    }
}
