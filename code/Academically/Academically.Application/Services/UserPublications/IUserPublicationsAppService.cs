using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Entities;
using Academically.Roles.Dto;
using Academically.Services.UserPublications.Dto;
using Academically.Users.Dto;

namespace Academically.Users
{
    public interface IUserPublicationsAppService : IAsyncCrudAppService<GetPublicationDto, Guid ,PagedPublicationResultRequestDto, SavePublicationDto, GetPublicationDto>
    {
    }
}
