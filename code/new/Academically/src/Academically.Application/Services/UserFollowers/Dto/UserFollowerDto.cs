using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.UserFollowers.Dto
{
	[AutoMap(typeof(UserFollower))]
	public class UserFollowerDto : EntityDto<Guid>
	{
        public long UserId { get; set; }
    }
}

