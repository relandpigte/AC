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
    public class SendResearchMethodRequestEmailJob : AcademicallyBackgroundJobBase<SendResearchMethodRequestEmailJobArgs>
    {
        private readonly IRepository<ResearchMethod, Guid> _researchMethodsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IEmailService _emailService;
        private readonly RoleManager _roleManager;

        public SendResearchMethodRequestEmailJob(
            IRepository<ResearchMethod, Guid> researchMethodsRepository,
            IRepository<User, long> usersRepository,
            IEmailService emailService,
            RoleManager roleManager
            )
        {
            _researchMethodsRepository = researchMethodsRepository;
            _usersRepository = usersRepository;
            _emailService = emailService;
            _roleManager = roleManager;
        }

        public override void Execute(SendResearchMethodRequestEmailJobArgs args)
        {
            var parentMethod = _researchMethodsRepository.Get(args.ParentId);
            var adminRole = _roleManager.GetRoleByName(StaticRoleNames.Tenants.Admin);
            var superAdminRole = _roleManager.GetRoleByName(StaticRoleNames.Tenants.SuperAdmin);
            var adminUsers = _usersRepository.GetAllList(e => e.Roles.Any(e => e.RoleId == adminRole.Id) || e.Roles.Any(e => e.RoleId == superAdminRole.Id));
            var requester = _usersRepository.Get(args.UserId);

            string subject = L("ResearchMethodRequestEmailSubject");
            string body = L("ResearchMethodRequestEmailMessage", args.Name, args.Comments, parentMethod.Name);
            _emailService.SendAsync(requester.EmailAddress, requester.EmailAddress, subject, body).Wait();

            string adminEmailSubject = L("ResearchMethodRequestAdminEmailSubject");
            string adminEmailBody = L("ResearchMethodRequestAdminEmailMessage", args.Name, args.Comments, parentMethod.Name, requester.FullName);
            foreach (var admin in adminUsers)
            {
                _emailService.SendAsync(admin.EmailAddress, admin.EmailAddress, adminEmailSubject, adminEmailBody).Wait();
            }
        }
    }
}
