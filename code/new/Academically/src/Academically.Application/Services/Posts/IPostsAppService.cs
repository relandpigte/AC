using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;

namespace Academically.Services.Posts
{
    public interface IPostsAppService : IApplicationService
    {
        Task<List<PostDto>> GetAllPosts(PostType? Type, Guid? parentId);
        Task<List<PostDto>> GetPostsByTopics(IEnumerable<string> topicIds);
        Task Create(CreatePostDto input);
        Task<List<PostDto>> GetByUser(long userId, PostType? type);
        Task<PostDto> GetAsync(Guid id);
        Task<PostDto> UpdateAsync(UpdatePostDto input);
        Task DeleteAsync(Guid id);
        Task<AvailableServiceDto> GetAvailableService(Guid id);
        Task CreatePostNotification(CreatePostNotificationDto input);
        Task DeletePostNotification(DeletePostNotificationDto input);
    }
}
