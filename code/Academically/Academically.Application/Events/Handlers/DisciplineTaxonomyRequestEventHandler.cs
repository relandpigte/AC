using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Events.Handlers
{
    public class DisciplineTaxonomyRequestEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<DisciplineTaxonomyRequest>>
    {
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomiesRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;
        private string fromName;
        private string fromEmail;
        public DisciplineTaxonomyRequestEventHandler(
            IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomiesRepository,
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            RoleManager roleManager,
            ISettingManager settingManager,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _disciplineTaxonomiesRepository = disciplineTaxonomiesRepository;
            _usersRepository = usersRepository;
            _emailService = emailService;
            _roleManager = roleManager;
            fromName = settingManager.GetSettingValue(AppSettingNames.Email_FromName);
            fromEmail = settingManager.GetSettingValue(AppSettingNames.Email_FromEmail);
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<DisciplineTaxonomyRequest> eventData)
        {
            var parentDisciplineTaxonomy = await _disciplineTaxonomiesRepository.GetAsync(eventData.Entity.ParentId);
            var adminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Admin);
            var superAdminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.SuperAdmin);
            var adminUsers = await _usersRepository.GetAllListAsync(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));
            var requester = await _usersRepository.GetAsync(eventData.Entity.CreatorUserId.Value);

            string subject = L("DisciplineTaxonomyRequestEmailSubject");
            string body = L("DisciplineTaxonomyRequestEmailMessage", eventData.Entity.Name, eventData.Entity.Notes, parentDisciplineTaxonomy.Name);
            await _emailService.SendAsync(requester.EmailAddress, requester.EmailAddress, subject, body);

            string adminEmailSubject = L("DisciplineTaxonomyRequestAdminEmailSubject");
            string adminEmailBody = L("DisciplineTaxonomyRequestAdminEmailMessage", eventData.Entity.Name, eventData.Entity.Notes, parentDisciplineTaxonomy.Name, requester.FullName);
            
            await _emailService.SendAsync(fromName, fromEmail, adminEmailSubject, adminEmailBody);
        }
    }
}
