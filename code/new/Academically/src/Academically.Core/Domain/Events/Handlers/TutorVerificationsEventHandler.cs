using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Domain.Events.Handlers
{
    public class TutorVerificationsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityUpdatedEventData<TutorVerification>>
    {
        private readonly IRepository<User, long> _usersRepository;
        private readonly RoleManager _roleManager;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public TutorVerificationsEventHandler(
            IRepository<User, long> usersRepository,
            RoleManager roleManager,
            ISettingManager settingManager,
            IEmailService emailService,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
            _roleManager = roleManager;
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityUpdatedEventData<TutorVerification> eventData)
        {
            if (eventData.Entity.CurrentStep == BecomeATutorStep.CompleteApplication && eventData.Entity.Status == TutorVerificationStatus.Completed)
            {
                var user = await _usersRepository.FirstOrDefaultAsync(eventData.Entity.CreatorUserId.Value);

                string subject = L("TutorApplicationCompletedEmailSubject");
                string body = L("TutorApplicationCompletedEmailMessage");
                await _emailService.SendAsync(user.FullName, user.EmailAddress, subject, body);

                string adminEmailSubject = L("TutorApplicationCompletedAdminEmailSubject", user.FullName);
                string adminEmailBody = L("TutorApplicationCompletedAdminEmailMessage", user.FullName);

                var adminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Admin);
                var superAdminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.SuperAdmin);
                var adminUsers = await _usersRepository.GetAllListAsync(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));

                foreach (var admin in adminUsers)
                {
                    await _emailService.SendAsync(admin.FullName, admin.EmailAddress, adminEmailSubject, adminEmailBody);
                }
            }
        }
    }
}
