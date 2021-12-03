using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Auditing;
using Abp.Domain.Repositories;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Services.Documents;
using Academically.Sessions.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Sessions
{
    public class SessionAppService : AcademicallyAppServiceBase, ISessionAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public SessionAppService(
            UserManager userManager,
            IRepository<UserEducation, Guid> userEducationsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _userManager = userManager;
            _userEducationsRepository = userEducationsRepository;
            _documentsDomainService = documentsDomainService;
        }

        [DisableAuditing]
        public async Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations()
        {
            var output = new GetCurrentLoginInformationsOutput
            {
                Application = new ApplicationInfoDto
                {
                    Version = AppVersionHelper.Version,
                    ReleaseDate = AppVersionHelper.ReleaseDate,
                    Features = new Dictionary<string, bool>(),
                    BaseDirectory = _documentsDomainService.GetBaseDirectory(),
                    ProfilePicturesFolderName = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_ProfilePictures),
                    CoverPhotoFolderName = await SettingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_CoverPhotos),
                }
            };

            if (AbpSession.TenantId.HasValue)
            {
                output.Tenant = ObjectMapper.Map<TenantLoginInfoDto>(await GetCurrentTenantAsync());
            }

            if (AbpSession.UserId.HasValue)
            {
                var user = await GetCurrentUserAsync();
                output.User = ObjectMapper.Map<UserLoginInfoDto>(user);
                output.User.Roles = await _userManager.GetRolesAsync(user);
                output.User.CurrentUniversity = await _userEducationsRepository.GetAll()
                    .Where(u => u.UserId == user.Id)
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                    .Select(e => e.University.HeProvider)
                    .FirstOrDefaultAsync();

                if (user.ProfilePictureDocumentId.HasValue)
                {
                    output.User.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(user.ProfilePictureDocumentId.Value);
                }

                if (user.CoverPhotoDocumentId.HasValue)
                {
                    output.User.CoverPictureUrl = await _documentsDomainService.GetFileUrlAsync(user.CoverPhotoDocumentId.Value);
                }
            }

            return output;
        }
    }
}
