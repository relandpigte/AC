using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Academically.Authorization.Users;
using Academically.Services.Documents.Dto;

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
        public bool IsPublic { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string ZipOrPostCode { get; set; }
        public string StateOrProvince { get; set; }
        public string Country { get; set; }
        public string WebsiteUrl { get; set; }
        public string About { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public DateTime CreationTime { get; set; }
        public string StripeUserId { get; set; }
        public bool IsPhoneNumberConfirmed { get; set; }

        public DocumentDto ProfilePictureDocument { get; set; }
        public DocumentDto CoverPhotoDocument { get; set; }

        public string CoverPhotoUrl { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string IntroVideoUrl { get; set; }
        public string CurrentUniversity { get; set; }
        public bool IsPresentUniversity { get; set; }
        public string TimeZoneId { get; set; }
        public IEnumerable<string> RoleNames { get; set; }
        public IEnumerable<string> RoleDisplayNames { get; set; }
    }
}
