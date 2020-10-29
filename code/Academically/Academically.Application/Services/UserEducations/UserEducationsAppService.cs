using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Entities;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.UserEducations
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Educations)]
    public class UserEducationsAppService : AsyncCrudAppService<UserEducation, UserEducationDto, Guid, PagedAndSortedUserEducationResultRequestDto>, IUserEducationsAppService
    {
        public UserEducationsAppService(IRepository<UserEducation, Guid> repository) : base(repository)
        {
            CreatePermissionName = PermissionNames.Pages_Profile_Educations_Create;
            UpdatePermissionName = PermissionNames.Pages_Profile_Educations_Update;
            DeletePermissionName = PermissionNames.Pages_Profile_Educations_Delete;
        }

        protected override IQueryable<UserEducation> CreateFilteredQuery(PagedAndSortedUserEducationResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .Where(e => e.UserId == input.UserId);
        }

        public override Task<UserEducationDto> CreateAsync(UserEducationDto input)
        {
            input.UserId = AbpSession.UserId.Value;
            return base.CreateAsync(input);
        }
    }
}
