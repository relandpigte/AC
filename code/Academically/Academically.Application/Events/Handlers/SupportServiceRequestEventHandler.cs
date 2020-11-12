using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Entities;

namespace Academically.Events.Handlers
{
    public class SupportServiceRequestEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<SupportServiceRequest>>
    {
        private readonly IRepository<SupportService, Guid> _supportServicesRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;

        public SupportServiceRequestEventHandler(
            IRepository<SupportService, Guid> supportServicesRepository,
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            RoleManager roleManager,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _supportServicesRepository = supportServicesRepository;
            _usersRepository = usersRepository;
            _emailService = emailService;
            _roleManager = roleManager;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<SupportServiceRequest> eventData)
        {
            var parentService = await _supportServicesRepository.GetAsync(eventData.Entity.ParentId);
            var adminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Admin);
            var superAdminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.SuperAdmin);
            var adminUsers = await _usersRepository.GetAllListAsync(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));
            var requester = await _usersRepository.GetAsync(eventData.Entity.CreatorUserId.Value);

            string subject = L("SupportServiceRequestEmailSubject");
            string body = L("SupportServiceRequestEmailMessage", eventData.Entity.Name, eventData.Entity.Comments, parentService.Name);
            await _emailService.SendAsync(requester.EmailAddress, requester.EmailAddress, subject, body);

            string adminEmailSubject = L("SupportServiceRequestAdminEmailSubject");
            string adminEmailBody = L("SupportServiceRequestAdminEmailMessage", eventData.Entity.Name, eventData.Entity.Comments, parentService.Name, requester.FullName);
            foreach (var admin in adminUsers)
            {
                await _emailService.SendAsync(admin.EmailAddress, admin.EmailAddress, adminEmailSubject, adminEmailBody);
            }
        }
    }
}
