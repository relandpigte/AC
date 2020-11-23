using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Academically.DomainServices.Tutorials;
using Academically.Entities;
using Microsoft.EntityFrameworkCore;

namespace Academically.Events.Handlers
{
    public class UserTutorialsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<UserTutorial>>
    {
        private readonly IRepository<SupportService, Guid> _supportServicesRepository;
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomiesRepository;
        private readonly ITutorialsDomainService _tutorialsDomainService;
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;

        public UserTutorialsEventHandler(
            IRepository<SupportService, Guid> supportServicesRepository,
            IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomiesRepository,
            ITutorialsDomainService tutorialsDomainService,
            ISettingManager settingManager,
            IEmailService emailService,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _supportServicesRepository = supportServicesRepository;
            _disciplineTaxonomiesRepository = disciplineTaxonomiesRepository;
            _tutorialsDomainService = tutorialsDomainService;
            _settingManager = settingManager;
            _emailService = emailService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<UserTutorial> eventData)
        {
            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string studentProposalLink = $"{clientRootAddress}app/student-proposal/{eventData.Entity.Id}";
            var supportService = await _supportServicesRepository.GetAsync(eventData.Entity.ServiceTypeId);

            var areasOfStudySb = new StringBuilder("<ul>");
            foreach (var tutorialAreaOfStudy in eventData.Entity.UserTutorialDisciplineTaxonomies)
            {
                var areaOfStudy = await _disciplineTaxonomiesRepository.GetAsync(tutorialAreaOfStudy.DisciplineTaxonomyId);
                areasOfStudySb.AppendLine($"<li>{areaOfStudy.Name}</li>");
            }
            areasOfStudySb.AppendLine("</ul>");

            string subject = L("StudentProposalEmailSubject", supportService.Name);
            var tutors = await _tutorialsDomainService.SearchTutors(eventData.Entity.Id);

            foreach (var tutor in tutors)
            {
                string body = L("StudentProposalEmailMessage", tutor.User.Name, areasOfStudySb.ToString(), studentProposalLink);
                await _emailService.SendAsync(tutor.User.FullName, tutor.User.EmailAddress, subject, body);
            }
        }
    }
}
