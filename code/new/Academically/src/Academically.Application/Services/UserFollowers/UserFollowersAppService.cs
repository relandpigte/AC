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
		private readonly IRepository<PostInvitation, Guid> _postInvitationRepository;
		private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IRepository<User, long> _userRepository;

        public UserFollowersAppService(
            IRepository<PostInvitation, Guid> postInvitationRepository,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IRepository<User, long> usersRepository)
		{
            _postInvitationRepository = postInvitationRepository;
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
                .Where(x => x.CreatorUserId == request.PostCreator)
                .ToListAsync();

            var results = items
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.User.FullName.ToLower().Contains(request.Keyword.ToLower()))
                .ToList();

            

            var dtos = results.Select(x => ObjectMapper.Map<UserFollowerInvitedDto>(x)).ToList();
            var invitedUserIds = await _postInvitationRepository.GetAll()
                .Where(i => i.CreatorUserId == request.PostCreator.Value)
                .Select(i => i.UserId)
                .ToListAsync();

            foreach(var x in dtos) {
                x.IsInvited = invitedUserIds.Any(i => x.UserId == i);
            }

            if (request.IsInvitedOnly.Value)
                dtos = dtos.Where(x => x.IsInvited).ToList();

            if (request.Take.HasValue)
                dtos = dtos.Take(request.Take.Value).ToList();

            return dtos;
        }
    }
}

