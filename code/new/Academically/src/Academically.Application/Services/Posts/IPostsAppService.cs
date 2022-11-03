using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;

namespace Academically.Services.Posts
{
    public interface IPostsAppService : IApplicationService
    {
        Task<List<PostDto>> GetAllPosts(PostType? Type);
        Task Create(CreatePostDto input);
    }
}
