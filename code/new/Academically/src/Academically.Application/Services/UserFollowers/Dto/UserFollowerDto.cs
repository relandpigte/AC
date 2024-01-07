using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.UserFollowers.Dto
{
	[AutoMap(typeof(UserFollower))]
	public class UserFollowerDto : CreationAuditedEntityDto<Guid>
	{
        public long UserId { get; set; }
		public UserDto User { get; set; }
    }
}

