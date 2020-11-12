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
    public class ResearchMethodRequestEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<ResearchMethodRequest>>
    {
        private readonly IRepository<ResearchMethod, Guid> _researchMethodsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;

        public ResearchMethodRequestEventHandler(
            IRepository<ResearchMethod, Guid> researchMethodsRepository,
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            RoleManager roleManager,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _researchMethodsRepository = researchMethodsRepository;
            _usersRepository = usersRepository;
            _emailService = emailService;
            _roleManager = roleManager;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<ResearchMethodRequest> eventData)
        {
            var parentMethod = await _researchMethodsRepository.GetAsync(eventData.Entity.ParentId);
            var adminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Admin);
            var superAdminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.SuperAdmin);
            var adminUsers = await _usersRepository.GetAllListAsync(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));
            var requester = await _usersRepository.GetAsync(eventData.Entity.CreatorUserId.Value);

            string subject = L("ResearchMethodRequestEmailSubject");
            string body = L("ResearchMethodRequestEmailMessage", eventData.Entity.Name, eventData.Entity.Comments, parentMethod.Name);
            await _emailService.SendAsync(requester.EmailAddress, requester.EmailAddress, subject, body);

            string adminEmailSubject = L("ResearchMethodRequestAdminEmailSubject");
            string adminEmailBody = L("ResearchMethodRequestAdminEmailMessage", eventData.Entity.Name, eventData.Entity.Comments, parentMethod.Name, requester.FullName);
            foreach (var admin in adminUsers)
            {
                await _emailService.SendAsync(admin.EmailAddress, admin.EmailAddress, adminEmailSubject, adminEmailBody);
            }
        }
    }
}
