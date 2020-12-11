using System;
using System.Threading.Tasks;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Application.Shared.Services;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Microsoft.EntityFrameworkCore;

namespace Academically.Events.Handlers
{
    public class TutorOffersEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<TutorOffer>>,
        ITransientDependency
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IRepository<User, long> _usersRepository;

        public TutorOffersEventHandler(
            ISettingManager settingManager,
            IEmailService emailService,
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            IRepository<User, long> usersRepository,
            ILocalizationManager localizationManager) : base(localizationManager)
        {
            _settingManager = settingManager;
            _emailService = emailService;
            _userTutorialsRepository = userTutorialsRepository;
            _userProfilesRepository = userProfilesRepository;
            _usersRepository = usersRepository;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<TutorOffer> eventData)
        {
            var tutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == eventData.Entity.TutorialId);
            var student = await _userProfilesRepository.GetAsync(tutorial.StudentId);
            var user = await _usersRepository.GetAsync(student.UserId);

            var clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            var offerLink = $"{clientRootAddress}app/tutorial/{eventData.Entity.TutorialId}";
            var subject = L("TutorOfferEmailSubject");
            var body = L("TutorOfferEmailMessage", user.FullName, offerLink);

            if (eventData.Entity.IsSubmitted)
            {
                await _emailService.SendAsync(user.FullName, user.EmailAddress, subject, body);
            }
        }
    }
}
