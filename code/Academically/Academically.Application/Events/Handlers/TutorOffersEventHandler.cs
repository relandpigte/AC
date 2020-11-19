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
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Events.Handlers
{
    public class TutorOffersEventHandler: 
        EventHandlerBase,
    IAsyncEventHandler<EntityCreatedEventData<TutorOffer>>,
        ITransientDependency
    {
        private readonly ISettingManager _settingManager;
        private readonly IEmailService _emailService;
        private readonly IRepository<UserTutorial, Guid> _userTutorialsRepository;
        private readonly IRepository<User, long> _usersRepository;
        public TutorOffersEventHandler(
            ISettingManager settingManager,
            IEmailService emailService,
            IRepository<UserTutorial, Guid> userTutorialsRepository,
            IRepository<User, long> usersRepository,
            ILocalizationManager localizationManager) : base(localizationManager)
        {
            _settingManager = settingManager;
            _emailService = emailService;
            _userTutorialsRepository = userTutorialsRepository;
            _usersRepository = usersRepository;
        }
        
        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<TutorOffer> eventData)
        {
            
            var tutorial = await _userTutorialsRepository.FirstOrDefaultAsync(e => e.Id == eventData.Entity.TutorialId);
            var user = await _usersRepository.FirstOrDefaultAsync(e => e.Id == tutorial.UserId);

            var clientRootAddress = await _settingManager.GetSettingValueAsync(AppSettingNames.App_ClientRootAddress);
            var offerLink = $"{clientRootAddress}app/tutor-proposal/{eventData.Entity.Id}";
            var subject = L("TutorOfferEmailSubject");
            var body = L("TutorOfferEmailMessage", user.FullName, offerLink);
            
            if (eventData.Entity.IsSubmitted)
            {
                await _emailService.SendAsync(user.FullName, user.EmailAddress, subject, body);
            }
        }
    }
}
