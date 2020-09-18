using System;
using System.Linq;
using Abp.Application.Services;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Entities;
using Academically.Services.UserPublications.Dto;
using Academically.Users;

namespace Academically.Services.UserPublications
{
    public class UserPublicationsAppService : AsyncCrudAppService<UserPublication, GetPublicationDto, Guid, PagedPublicationResultRequestDto, SavePublicationDto, GetPublicationDto>, IUserPublicationsAppService
    {
        public UserPublicationsAppService(IRepository<UserPublication, Guid> repository) : base(repository)
        {
            GetAllPermissionName = PermissionNames.Pages_Profile_Publications;
            GetPermissionName = PermissionNames.Pages_Profile_Publications;
            CreatePermissionName = PermissionNames.Pages_Profile_Publications_Create;
            UpdatePermissionName = PermissionNames.Pages_Profile_Publications_Update;
            DeletePermissionName = PermissionNames.Pages_Profile_Publications_Delete;
        }

        protected override IQueryable<UserPublication> CreateFilteredQuery(PagedPublicationResultRequestDto input)
        {
            return Repository.GetAll()
                     .Where(x => x.UserId == input.UserId)
                     .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x =>
                     x.PublicationCertificate.Contains(input.Keyword)
                     || x.Publisher.Contains(input.Keyword)
                     || x.Summary.Contains(input.Keyword));
        }
    }
}
