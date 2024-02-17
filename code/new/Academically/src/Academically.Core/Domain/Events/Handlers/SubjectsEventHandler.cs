using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Domain.Events.Handlers
{
    public class SubjectsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatingEventData<Subject>>,
        IAsyncEventHandler<EntityUpdatedEventData<Subject>>
    {
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<Service, Guid> _servicesRepository;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;

        public SubjectsEventHandler(
            IRepository<User, long> usersRepository,
            IRepository<Service, Guid> servicesRepository,
            ISettingManager settingManager,
            IEmailService emailService,
            RoleManager roleManager,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
            _servicesRepository = servicesRepository;
            _settingManager = settingManager;
            _emailService = emailService;
            _roleManager = roleManager;
        }

        public async Task HandleEventAsync(EntityCreatingEventData<Subject> eventData)
        {
            var requester = await _usersRepository.GetAsync(eventData.Entity.CreatorUserId.Value);
            var service = await _servicesRepository.GetAsync(eventData.Entity.ServiceSubjects.FirstOrDefault().ServiceId);
            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string subjectSuggestionLink = Uri.EscapeUriString($"{clientRootAddress}/app/suggestions/service-subjects/{service.Name}");

            string adminEmailSubject = L("ServiceSubjectSuggestionAdminEmailSubject");
            string adminEmailBody = L("ServiceSubjectSuggestionAdminEmailMessage", eventData.Entity.Name, service.Name, requester.FullName, subjectSuggestionLink);

            var adminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Admin);
            var superAdminRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.SuperAdmin);
            var adminUsers = await _usersRepository.GetAllListAsync(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));

            foreach (var admin in adminUsers)
            {
                await _emailService.SendAsync(admin.FullName, admin.EmailAddress, adminEmailSubject, adminEmailBody);
            }
        }

        public async Task HandleEventAsync(EntityUpdatedEventData<Subject> eventData)
        {
            var requester = await _usersRepository.GetAsync(eventData.Entity.CreatorUserId.Value);
            var service = await _servicesRepository.GetAsync(eventData.Entity.ServiceSubjects.FirstOrDefault().ServiceId);

            string emailSubject = L("ServiceSubjectSuggestionEmailSubject");
            string emailBody = string.Empty;
            if (eventData.Entity.ReviewStatus == SubjectReviewStatus.Approved)
            {
                emailBody = L("ServiceSubjectSuggestionApprovedEmailMessage", eventData.Entity.Name, service.Name);
            }
            else if (eventData.Entity.ReviewStatus == SubjectReviewStatus.Rejected)
            {
                emailBody = L("ServiceSubjectSuggestionRejectedEmailMessage", eventData.Entity.Name, service.Name);
            }

            await _emailService.SendAsync(requester.FullName, requester.EmailAddress, emailSubject, emailBody);
        }
    }
}
