using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Entities;
using Academically.Entities.Enums;
using Academically.Extensions;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.UserEducations
{
    public class UserEducationsAppService : AsyncCrudAppService<UserEducation, UserEducationDto, Guid, PagedAndSortedResultRequestDto>, IUserEducationsAppService
    {
        public UserEducationsAppService(IRepository<UserEducation, Guid> repository) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;
            GetAllPermissionName = PermissionNames.Pages_Profile_Educations;
            GetPermissionName = PermissionNames.Pages_Profile_Educations;
            CreatePermissionName = PermissionNames.Pages_Profile_Educations_Create;
            UpdatePermissionName = PermissionNames.Pages_Profile_Educations_Update;
            DeletePermissionName = PermissionNames.Pages_Profile_Educations_Delete;
        }

        public IEnumerable<EnumItem> GetLevels()
        {
            var items = EnumExtensions.ToList<EducationLevel>();
            foreach (var item in items)
            {
                item.Text = L($"Education{item.Text}");
            }
            return items.OrderByDescending(e => e.Value);
        }

        public override Task<UserEducationDto> CreateAsync(UserEducationDto input)
        {
            input.UserId = AbpSession.UserId.Value;
            return base.CreateAsync(input);
        }

        protected override UserEducationDto MapToEntityDto(UserEducation entity)
        {
            var output = base.MapToEntityDto(entity);
            output.LevelText = L($"Education{output.Level}");
            return output;
        }
    }
}
