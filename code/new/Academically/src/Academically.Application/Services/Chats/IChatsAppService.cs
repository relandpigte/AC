using Abp.Application.Services;
using Academically.Services.Chats.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.Chats
{
    public interface IChatsAppService : IApplicationService
    {
        Task<ChannelDto> GetChannel(Guid channelId);
        Task<ChannelMessageDto> GetChannelMessage(Guid channelMessageId);
        Task<ChannelMemberDto> GetChannelMember(Guid channelMemberId);
        Task<List<ChannelDto>> GetAllChannelsForUser(long? userId);
        Task<List<ChannelDto>> GetAllInboxChannelsForUser(long? userId);
        Task<List<ChannelDto>> GetAllArchivedChannelsForUser(long? userId);
        Task<List<ChannelDto>> GetReferenceChannelsForUser(Guid referenceId, bool isPrivate);
        Task<List<ChannelMessageDto>> GetAllChannelMessages(Guid? channelId, Guid? referenceId, bool isPrivate);
        Task<List<ChannelMemberDto>> GetAllChannelMembers(Guid channelId);
        Task<ChannelDto> CreateChannel(CreateChannelInputDto input);
        Task<ChannelMessageDto> CreateChannelMessage(CreateChannelMessageInputDto input);
        Task<ChannelMessageDto> UpdateChannelMessage(UpdateChannelMessageInputDto input);
        Task<bool> SeenChannelMessages(Guid channelId, DateTime targetMessagesDateTime);
        Task<bool> SetChannelMemberTyping(Guid channelId, bool isTyping);
        Task<bool> ArchiveChannel(Guid channelId, long? userId);
        Task<bool> UnarchiveChannel(Guid channelId, long? userId);
        Task<bool> DeleteChannel(Guid channelId);
        Task<bool> ReportTyping(Guid channelId);
        Task<SearchByKeywordResponseDto> SearchByKeyword(string keyword);
        Task CreateChannelNotification(Guid channelId);
        Task DeleteChannelNotification(Guid channelId);
        Task<ChannelDto> GetChannelByRecipient(long recipientId, long senderId);
        Task<EventUsersResponseDto> GetEventUsers();
        Task<bool> DeleteChannelMessage(Guid channelMessageId);
    }
}
