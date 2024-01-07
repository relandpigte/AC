using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;

namespace Academically.Services.UserFollowers.Dto
{
    [AutoMap(typeof(UserFollower))]
    public class UserFollowerInvitedDto : CreationAuditedEntityDto<Guid>
    {
        public long UserId { get; set; }
        public UserDto User { get; set; }
        public bool IsInvited { get; set; }
    }
}
