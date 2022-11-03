using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Posts.Dto;

namespace Academically.Services.Posts
{
    public interface IPostsAppService : IApplicationService
    {
        Task Create(CreatePostDto input);
    }
}
