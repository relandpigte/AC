using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.UserFollowers.Dto;
using Academically.Users.Dto;

namespace Academically.Services.UserFollowers
{
	public interface IUserFollowersAppService : IApplicationService
	{
		Task<UserFollowerDto> GetAsync(long userId, long followerUserId);
		Task<UserFollowerDto> CreateAsync(long userId);
		Task DeleteAsync(Guid id);
		Task<IEnumerable<UserDto>> GetUsersToFollow();
		Task<IEnumerable<UserFollowerDto>> GetFollowing();
    }
}

