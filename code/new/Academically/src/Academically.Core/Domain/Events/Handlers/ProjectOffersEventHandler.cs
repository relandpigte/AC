using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using System;
using System.Threading.Tasks;
namespace Academically.Domain.Events.Handlers
{
    public class ProjectOffersEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<ProjectOffer>>
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<User, long> _usersRepository;

        public ProjectOffersEventHandler(
            ISettingManager settingManager,
            IEmailService emailService,
            ILocalizationManager localizationManager,
            IRepository<User, long> usersRepository,
            IRepository<Project, Guid> projectsRepository
            ) : base(localizationManager)
        {
            _settingManager = settingManager;
            _emailService = emailService;
            _usersRepository = usersRepository;
            _projectsRepository = projectsRepository;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<ProjectOffer> eventData)
        {
            string clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            string registrationLink = $"{clientRootAddress}/app/projects/{eventData.Entity.ProjectId}/proposals";
            string subject = L("ProjectOfferEmailSubject");

            var project = await _projectsRepository.GetAsync(eventData.Entity.ProjectId);
            var creator = await _usersRepository.GetAsync(project.CreatorUserId ?? 0);

            if (project != null && creator != null)
            {
                string body = L("ProjectOfferEmailMessage", creator.FullName, project.Name, registrationLink);
                await _emailService.SendAsync(creator.FullName, creator.EmailAddress, subject, body);
            }
        }
    }
}