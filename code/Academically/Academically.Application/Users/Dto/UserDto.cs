using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Academically.Authorization.Users;
using Academically.Services.DisciplineTaxonomyStudyLevels.Dto;
using Academically.Services.Proposals.Dto;
using Academically.Services.UserEducations.Dto;
using Academically.Services.UserProfiles.Dto;

namespace Academically.Users.Dto
{
    [AutoMapFrom(typeof(User))]
    public class UserDto : EntityDto<long>
    {
        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(AbpUserBase.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }

        public bool IsActive { get; set; }

        public string FullName { get; set; }

        public DateTime? LastLoginTime { get; set; }

        public DateTime CreationTime { get; set; }

        public string[] RoleNames { get; set; }
        public string[] RoleDisplayNames { get; set; }
        public bool IsTwoFactorEnabled { get; set; }
        public bool IsRecommended { get; set; }
        public IEnumerable<UserEducationDto> UserEducations { get; set; }
        public IEnumerable<UserDisciplineTaxonomyStudyLevelDto> UserDisciplineTaxonomyStudyLevels { get; set; }
        public IEnumerable<UserSupportServiceDto> UserSupportServices { get; set; }
        public IEnumerable<GetUserDisciplineTaxonomyDto> UserDisciplineTaxonomies { get; set; }
    }
}
