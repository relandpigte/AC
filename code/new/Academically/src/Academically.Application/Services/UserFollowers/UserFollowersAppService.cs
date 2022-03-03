using System;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.UserFollowers.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserFollowers
{
    public class UserFollowersAppService : AcademicallyAppServiceBase, IUserFollowersAppService
	{
		private readonly IRepository<UserFollower, Guid> _userFollowersRepository;

		public UserFollowersAppService(IRepository<UserFollower, Guid> userFollowersRepository)
		{
			_userFollowersRepository = userFollowersRepository;
        }

        public async Task<UserFollowerDto> GetAsync(long userId, long followerUserId)
        {
            var userFollower = await _userFollowersRepository.GetAll()
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CreatorUserId == followerUserId);
            return ObjectMapper.Map<UserFollowerDto>(userFollower);
        }

        public async Task<UserFollowerDto> CreateAsync(long userId)
        {
            var userFollower = new UserFollower()
            {
                UserId = userId,
                CreatorUserId = AbpSession.UserId.Value,
            };
            await _userFollowersRepository.InsertAsync(userFollower);
            return ObjectMapper.Map<UserFollowerDto>(userFollower);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _userFollowersRepository.DeleteAsync(id);
        }
    }
}

