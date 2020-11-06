using System;
using System.Linq;
using Abp.Domain.Repositories;
using Academically.Application.Shared.Services;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.BackgroundJobs.JobArgs;
using Academically.Entities;

namespace Academically.BackgroundJobs
{
    public class SendSupportServiceRequestEmailJob : AcademicallyBackgroundJobBase<SendSupportServiceRequestEmailJobArgs>
    {
        private readonly IRepository<SupportService, Guid> _supportServicesRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;

        public SendSupportServiceRequestEmailJob(
            IRepository<SupportService, Guid> supportServicesRepository,
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            RoleManager roleManager
            )
        {
            _supportServicesRepository = supportServicesRepository;
            _usersRepository = usersRepository;
            _emailService = emailService;
            _roleManager = roleManager;
        }

        public override void Execute(SendSupportServiceRequestEmailJobArgs args)
        {
            var parentService = _supportServicesRepository.Get(args.ParentId);
            var adminRole = _roleManager.GetRoleByName(StaticRoleNames.Tenants.Admin);
            var superAdminRole = _roleManager.GetRoleByName(StaticRoleNames.Tenants.SuperAdmin);
            var adminUsers = _usersRepository.GetAllList(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));
            var requester = _usersRepository.Get(args.UserId);

            string subject = L("SupportServiceRequestEmailSubject");
            string body = L("SupportServiceRequestEmailMessage", args.Name, args.Comments, parentService.Name);
            _emailService.SendAsync(requester.EmailAddress, requester.EmailAddress, subject, body).Wait();

            string adminEmailSubject = L("SupportServiceRequestAdminEmailSubject");
            string adminEmailBody = L("SupportServiceRequestAdminEmailMessage", args.Name, args.Comments, parentService.Name, requester.FullName);
            foreach (var admin in adminUsers)
            {
                _emailService.SendAsync(admin.EmailAddress, admin.EmailAddress, adminEmailSubject, adminEmailBody).Wait();
            }
        }
    }
}
