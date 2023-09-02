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
        Task<List<ChannelMessageDto>> GetAllChannelMessages(Guid channelId);
        Task<List<ChannelMemberDto>> GetAllChannelMembers(Guid channelId);
        Task<ChannelMessageDto> CreateChannelMessage(CreateChannelMessageInputDto input);
        Task<ChannelMessageDto> UpdateChannelMessage(UpdateChannelMessageInputDto input);
        Task<bool> ArchiveChannel(Guid channelId);
        Task<bool> UnarchiveChannel(Guid channelId);
        Task<bool> DeleteChannel(Guid channelId);
        Task<bool> ReportTyping(Guid channelId);
    }
}
