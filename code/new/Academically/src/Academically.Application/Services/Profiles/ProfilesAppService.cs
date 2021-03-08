using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Authorization.Users;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Profiles
{
    [AbpAuthorize(PermissionNames.Pages_Profile)]
    public class ProfilesAppService : AcademicallyAppServiceBase, IProfilesAppService
    {
        private IRepository<User, long> _usersRepository;
        private UserManager _userManager;

        public ProfilesAppService(
            IRepository<User, long> usersRepository,
            UserManager userManager
            )
        {
            _usersRepository = usersRepository;
            _userManager = userManager;
        }

        public async Task<UserDto> Get(long id)
        {
            var user = await _usersRepository.GetAllIncluding(e => e.Roles)
                .FirstOrDefaultAsync(e => e.Id == id);
            var output = ObjectMapper.Map<UserDto>(user);
            output.RoleNames = await _userManager.GetRolesAsync(user);
            return output;
        }

        public async Task UpdateWebsiteUrl(string websiteUrl)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.WebsiteUrl = websiteUrl;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task UpdateAbout(string about)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.About = about;
            await _usersRepository.UpdateAsync(user);
        }
    }
}
