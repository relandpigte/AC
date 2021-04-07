using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.UserPublications.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.UserPublications
{
    public interface IUserPublicationsAppService : IApplicationService
    {
        Task<PagedResultDto<UserPublicationDto>> GetPaged(PagedUserPublicationRequestDto input);
        Task<IEnumerable<PublicationTagDto>> GetTags(string nameFilter);
        Task Create(UserPublicationDto input);
    }
}
