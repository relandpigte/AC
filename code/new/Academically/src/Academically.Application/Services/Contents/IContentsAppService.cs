using Abp.Application.Services;
using Academically.Services.Contents.Dto;
using System.Threading.Tasks;

namespace Academically.Services.Contents
{
    public interface IContentsAppService : IApplicationService
    {
        Task<ContentDto> GetAsync(string referenceId);
        Task SaveAsync(ContentDto input);
    }
}
