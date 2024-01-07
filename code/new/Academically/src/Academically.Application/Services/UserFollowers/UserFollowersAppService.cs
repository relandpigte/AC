using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Services.UserFollowers.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Abp.Extensions;
using Academically.Services.DisciplineTaxonomies.Dto;
using Abp.Linq.Extensions;
using Abp.Collections.Extensions;

namespace Academically.Services.UserFollowers
{
    public class UserFollowersAppService : AcademicallyAppServiceBase, IUserFollowersAppService
	{
		private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IRepository<User, long> _userRepository;

        public UserFollowersAppService(
            IRepository<UserFollower, Guid> userFollowersRepository,
            IRepository<User, long> usersRepository)
		{
			_userFollowersRepository = userFollowersRepository;
            _userRepository = usersRepository;
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

        public async Task<IEnumerable<UserDto>> GetUsersToFollow()
        {
            var following = await _userFollowersRepository.GetAll()
                .Where(x => x.CreatorUserId == AbpSession.UserId.Value)
                .Select(x => x.UserId)
                .ToListAsync();

            var usersToFollow = await _userRepository.GetAll()
                .Where(x => x.Id != AbpSession.UserId.Value && !following.Contains(x.Id))
                .ToListAsync();

            return ObjectMapper.Map<List<UserDto>>(usersToFollow);
        }

        public async Task<IEnumerable<UserFollowerDto>> GetFollowing()
        {
            var following = await _userFollowersRepository.GetAll()
                .Include(x => x.User)
                .Where(x => x.CreatorUserId == AbpSession.UserId.Value)
                .ToListAsync();

            return ObjectMapper.Map<List<UserFollowerDto>>(following);
        }
        
        public async Task<IEnumerable<UserFollowerDto>> GetFollowers()
        {
            var following = await _userFollowersRepository.GetAll()
                .Where(x => x.UserId == AbpSession.UserId.Value)
                .ToListAsync();

            return ObjectMapper.Map<List<UserFollowerDto>>(following);
        }

        public async Task<IEnumerable<UserFollowerInvitedDto>> SearchFollowingInvited(SearchFollowingInvitedDto request)
        {
            var items = await _userFollowersRepository.GetAll()
                .Include(x => x.User)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .ToListAsync();

            var results = items
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.User.FullName.ToLower().Contains(request.Keyword.ToLower()))
                .ToList();

            if (request.Take.HasValue)
                results = results.Take(request.Take.Value).ToList();

            return results.Select(x => ObjectMapper.Map<UserFollowerInvitedDto>(x)).ToList();
        }
    }
}

