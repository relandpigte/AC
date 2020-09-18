using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Entities;
using Academically.Services.UserPublications.Dto;

namespace Academically.Services.UserPublications
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Publications)]
    public class UserPublicationsAppService : AsyncCrudAppService<UserPublication, UserPublicationDto, Guid, PagedAndSortedResultRequestDto>, IUserPublicationsAppService
    {
        public UserPublicationsAppService(IRepository<UserPublication, Guid> repository) : base(repository)
        {
            CreatePermissionName = PermissionNames.Pages_Profile_Publications_Create;
            UpdatePermissionName = PermissionNames.Pages_Profile_Publications_Update;
            DeletePermissionName = PermissionNames.Pages_Profile_Publications_Delete;
        }

        protected override IQueryable<UserPublication> CreateFilteredQuery(PagedAndSortedResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.UserId == AbpSession.UserId.Value);
        }

        public override Task<UserPublicationDto> CreateAsync(UserPublicationDto input)
        {
            input.UserId = AbpSession.UserId.Value;
            return base.CreateAsync(input);
        }
    }
}
