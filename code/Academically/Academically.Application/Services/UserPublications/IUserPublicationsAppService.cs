using System;
using Abp.Application.Services;
using Academically.Services.UserPublications.Dto;

namespace Academically.Services.UserPublications
{
    public interface IUserPublicationsAppService : IAsyncCrudAppService<UserPublicationDto, Guid, PagedAndSortedUserPublicationResultRequestDto>
    {
    }
}
