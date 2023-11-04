using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using Abp.Localization;
using Abp.Runtime.Session;
using Abp.UI;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Services.Documents;
using Academically.Roles.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Academically.Users
{
    [AbpAuthorize(PermissionNames.Pages_Users, PermissionNames.Pages_AccountSettings)]
    public class UserAppService : AsyncCrudAppService<User, UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>, IUserAppService
    {
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<Role> _roleRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IAbpSession _abpSession;
        private readonly LogInManager _logInManager;
        private readonly UrlEncoder _urlEncoder;
        private readonly ISettingManager _settingManager;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<UserFollower, Guid> _userFollowersRepository;
        private readonly IRepository<UserBlocking, Guid> _userBlockingsRepository;
        private readonly IRepository<UserStatusLog, long> _userStatusLog;

        public UserAppService(
            IRepository<User, long> repository,
            UserManager userManager,
            RoleManager roleManager,
            IRepository<Role> roleRepository,
            IPasswordHasher<User> passwordHasher,
            IAbpSession abpSession,
            LogInManager logInManager,
            UrlEncoder urlEncoder,
            ISettingManager settingManager,
            IDocumentsDomainService documentsDomainService,
            IRepository<UserFollower, Guid> userFollowersRepository,
            IRepository<UserBlocking, Guid> userBlockingsRepository,
            IRepository<UserStatusLog, long> userStatusLog
            )
            : base(repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _roleRepository = roleRepository;
            _passwordHasher = passwordHasher;
            _abpSession = abpSession;
            _logInManager = logInManager;
            _urlEncoder = urlEncoder;
            _settingManager = settingManager;
            _documentsDomainService = documentsDomainService;
            _userFollowersRepository = userFollowersRepository;
            _userBlockingsRepository = userBlockingsRepository;
            _userStatusLog = userStatusLog;
        }

        [AbpAuthorize(PermissionNames.Pages_Users_Create)]
        public override async Task<UserDto> CreateAsync(CreateUserDto input)
        {
            CheckCreatePermission();

            var user = ObjectMapper.Map<User>(input);

            user.TenantId = AbpSession.TenantId;
            user.IsEmailConfirmed = true;

            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);

            CheckErrors(await _userManager.CreateAsync(user, input.Password));

            if (input.RoleNames != null)
            {
                CheckErrors(await _userManager.SetRolesAsync(user, input.RoleNames));
            }

            await UpdateLockOutEnabled(user);

            CurrentUnitOfWork.SaveChanges();

            return MapToEntityDto(user);
        }

        [AbpAuthorize(PermissionNames.Pages_Users_Update)]
        public override async Task<UserDto> UpdateAsync(UserDto input)
        {
            CheckUpdatePermission();

            var user = await _userManager.GetUserByIdAsync(input.Id);

            MapToEntity(input, user);

            CheckErrors(await _userManager.UpdateAsync(user));

            if (input.RoleNames != null)
            {
                CheckErrors(await _userManager.SetRolesAsync(user, input.RoleNames.ToArray()));
            }

            return await GetAsync(input);
        }

        [AbpAuthorize(PermissionNames.Pages_Users_Delete)]
        public override async Task DeleteAsync(EntityDto<long> input)
        {
            var user = await _userManager.GetUserByIdAsync(input.Id);
            await _userManager.DeleteAsync(user);
        }

        public async Task<ListResultDto<RoleDto>> GetRoles()
        {
            var roles = await _roleRepository.GetAllListAsync();
            return new ListResultDto<RoleDto>(ObjectMapper.Map<List<RoleDto>>(roles));
        }

        public async Task ChangeLanguage(ChangeUserLanguageDto input)
        {
            await SettingManager.ChangeSettingForUserAsync(
                AbpSession.ToUserIdentifier(),
                LocalizationSettingNames.DefaultLanguage,
                input.LanguageName
            );
        }

        protected override User MapToEntity(CreateUserDto createInput)
        {
            var user = ObjectMapper.Map<User>(createInput);
            user.SetNormalizedNames();
            return user;
        }

        protected override void MapToEntity(UserDto input, User user)
        {
            ObjectMapper.Map(input, user);
            user.SetNormalizedNames();
        }

        protected override UserDto MapToEntityDto(User user)
        {
            var roleIds = user.Roles.Select(x => x.RoleId).ToArray();

            var roles = _roleManager.Roles.Where(r => roleIds.Contains(r.Id)).ToList();

            var userDto = base.MapToEntityDto(user);
            userDto.RoleNames = roles.Select(e => e.NormalizedName).ToArray();
            userDto.RoleDisplayNames = roles.Select(e => e.DisplayName).ToArray();

            if (userDto.ProfilePictureDocumentId.HasValue)
                userDto.ProfilePictureUrl = Task.Run(async () => await _documentsDomainService.GetFileUrlAsync(userDto.ProfilePictureDocumentId.Value)).Result;

            return userDto;
        }

        protected override IQueryable<User> CreateFilteredQuery(PagedUserResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.Roles)
                .Include(x => x.ProfilePictureDocument)
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(input.Keyword)
                    || x.Surname.Contains(input.Keyword)
                    || x.EmailAddress.Contains(input.Keyword)
                    || x.Id.ToString().Contains(input.Keyword))
                .WhereIf(input.IsActive.HasValue, x => x.IsActive == input.IsActive)
                .WhereIf(input.ExcludeSelf.HasValue, x => x.Id != _abpSession.UserId.Value);
        }

        protected override async Task<User> GetEntityByIdAsync(long id)
        {
            var user = await Repository.GetAllIncluding(x => x.Roles).FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new EntityNotFoundException(typeof(User), id);
            }

            return user;
        }

        protected override IQueryable<User> ApplySorting(IQueryable<User> query, PagedUserResultRequestDto input)
        {
            if (input.Sorting.Contains("role"))
            {
                var roles = _roleManager.Roles;
                var sortParts = input.Sorting.Split(" ");
                var userQuery = query.Select(u => new
                {
                    User = u,
                    Role = roles.Where(r => u.Roles.Any(ur => ur.RoleId == r.Id)).Select(r => r.DisplayName).FirstOrDefault()
                });

                if (sortParts.Length > 1 && sortParts[1] == "desc")
                    return userQuery.OrderByDescending(s => s.Role).Select(s => s.User);
                else
                    return userQuery.OrderBy(s => s.Role).Select(s => s.User);
            }

            return base.ApplySorting(query, input);
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        [AbpAuthorize(PermissionNames.Pages_AccountSettings_Security)]
        public async Task<bool> ChangePassword(ChangePasswordDto input)
        {
            if (_abpSession.UserId == null)
            {
                throw new UserFriendlyException("Please log in before attemping to change password.");
            }
            long userId = _abpSession.UserId.Value;
            var user = await _userManager.GetUserByIdAsync(userId);
            var loginAsync = await _logInManager.LoginAsync(user.UserName, input.CurrentPassword, shouldLockout: false);
            if (loginAsync.Result != AbpLoginResultType.Success)
            {
                throw new UserFriendlyException("Your 'Existing Password' did not match the one on record.  Please try again or contact an administrator for assistance in resetting your password.");
            }
            if (!new Regex(AcademicallyConsts.PasswordRegexValidator).IsMatch(input.NewPassword))
            {
                throw new UserFriendlyException("Passwords must be at least 8 characters, contain a lowercase, uppercase, number and special character.");
            }
            user.Password = _passwordHasher.HashPassword(user, input.NewPassword);
            CurrentUnitOfWork.SaveChanges();
            return true;
        }

        public async Task<bool> ResetPassword(ResetPasswordDto input)
        {
            if (_abpSession.UserId == null)
            {
                throw new UserFriendlyException("Please log in before attemping to reset password.");
            }
            long currentUserId = _abpSession.UserId.Value;
            var currentUser = await _userManager.GetUserByIdAsync(currentUserId);
            var loginAsync = await _logInManager.LoginAsync(currentUser.UserName, input.AdminPassword, shouldLockout: false);
            if (loginAsync.Result != AbpLoginResultType.Success)
            {
                throw new UserFriendlyException("Your 'Admin Password' did not match the one on record.  Please try again.");
            }
            if (currentUser.IsDeleted || !currentUser.IsActive)
            {
                return false;
            }
            var roles = await _userManager.GetRolesAsync(currentUser);
            if (!roles.Contains(StaticRoleNames.Tenants.Admin))
            {
                throw new UserFriendlyException("Only administrators may reset passwords.");
            }

            var user = await _userManager.GetUserByIdAsync(input.UserId);
            if (user != null)
            {
                user.Password = _passwordHasher.HashPassword(user, input.NewPassword);
                CurrentUnitOfWork.SaveChanges();
            }

            return true;
        }

        public async Task<Tuple<List<UserDto>, List<UserDto>>> SearchUsersByName([FromForm] PagedUserResultRequestDto input)
        {
            var connectedUsers = await GetSearchedUsers(input);
            var otherUsers = await GetSearchedUsers(input, false);

            return Tuple.Create(connectedUsers, otherUsers);
        }

        public async Task<UserBlocking> BlockUserById(long userId)
        {
            return await _userBlockingsRepository.InsertAsync(new UserBlocking { BlockedUserId = userId });
        }
        
        public async Task<bool> UnblockUserById(long userId)
        {
            var currentUserId = _abpSession.UserId.Value;
            var blockedUser = await _userBlockingsRepository.GetAll()
                .Where(u => u.BlockedUserId == userId && u.CreatorUserId == currentUserId)
                .FirstOrDefaultAsync();

            if (blockedUser == null) return false;
            await _userBlockingsRepository
                .DeleteAsync(u => u.BlockedUserId == userId && u.CreatorUserId == currentUserId);
            return true;
        }

        private async Task<List<UserDto>> GetSearchedUsers(PagedUserResultRequestDto input, bool isFollowing = true)
        {
            var currentUserId = _abpSession.UserId.Value;
            var adminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Admin);
            var following = await _userFollowersRepository.GetAll()
                .Where(x => x.CreatorUserId == currentUserId)
                .Select(x => x.UserId)
                .ToListAsync();
            
            return await Repository.GetAll()
                .Include(u => u.ProfilePictureDocument)
                .Where(u => u.Id != currentUserId && isFollowing ?
                    following.Contains(u.Id) :
                    !following.Contains(u.Id))
                .Where(e => e.Roles.Any(r => r.RoleId != adminRole.Id) && !input.Keyword.IsNullOrWhiteSpace())
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(input.Keyword) || x.Surname.Contains(input.Keyword))
                .WhereIf(input.IsActive.HasValue, x => x.IsActive == input.IsActive)
                .WhereIf(input.ExcludeSelf.HasValue, x => x.Id != currentUserId)
                .Select(u => ObjectMapper.Map<UserDto>(u))
                .ToListAsync();

        }

        private async Task UpdateLockOutEnabled(User user)
        {
            user.IsLockoutEnabled = false;
            await _userManager.UpdateAsync(user);
        }
        
        public async Task<List<UserStatusLogDto>> GetAllUserStatusLogs()
        {
            var result = new List<UserStatusLogDto>();
            var statusLogs = await _userStatusLog.GetAll()
                .Include(us => us.CreatorUser)
                .OrderByDescending(us => us.CreationTime)
                .Select(us => ObjectMapper.Map<UserStatusLogDto>(us))
                .ToListAsync();

            foreach (var logs in statusLogs)
            {
                if (result.All(ua => ua.CreatorUserId != logs.CreatorUserId))
                {
                    result.Add(logs);
                }
            }
            return result;
        }
        
        public async Task CreateUserStatusLog([FromForm] UserStatus status)
        {
            await _userStatusLog.InsertAsync(new UserStatusLog { Status = status});
        }
        
        public async Task<UserStatusLogDto> GetUserStatusLog(long statusLogId)
        {
            return await _userStatusLog.GetAll()
                .Include(us => us.CreatorUser)
                .Where(us => us.Id == statusLogId)
                .Select(us => ObjectMapper.Map<UserStatusLogDto>(us))
                .FirstOrDefaultAsync();
        }

        public async Task<List<UserDto>> GetBlockedUsers(long? userId)
        {
            var blockedUsers = await _userBlockingsRepository.GetAll()
                .WhereIf(userId.HasValue, x => x.CreatorUserId == userId.Value)
                .WhereIf(!userId.HasValue, x => x.CreatorUserId == AbpSession.GetUserId())
                .Select(x => ObjectMapper.Map<UserDto>(x.BlockedUser))
                .ToListAsync();

            foreach (var user in blockedUsers.Where(user => user.ProfilePictureDocumentId != null))
            {
                user.ProfilePictureUrl = await _documentsDomainService
                    .GetFileUrlAsync(user.ProfilePictureDocumentId.Value);
            }

            return blockedUsers;
        }
    }
}

