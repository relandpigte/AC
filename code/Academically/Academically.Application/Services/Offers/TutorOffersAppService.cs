using Abp.Configuration;
using Abp.Domain.Repositories;
using Academically.Application.Shared.Services;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.Offers.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Offers
{
    public class TutorOffersAppService : AcademicallyAppServiceBase, ITutorOffersAppService
    {
        private readonly IRepository<TutorOffer, Guid> _tutorOffersRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IEmailService _emailService;
        private readonly ISettingManager _settingManager;
        public TutorOffersAppService(
            IRepository<TutorOffer, Guid> tutorOffersRepository, 
            IRepository<User, long> userRepository, 
            IEmailService emailService,
            ISettingManager settingManager)
        {
            _tutorOffersRepository = tutorOffersRepository;
            _userRepository = userRepository;
            _emailService = emailService;
            _settingManager = settingManager;
        }

        public async Task CreateAsync(CreateTutorOfferDto input)
        {
            var tutorId = AbpSession.UserId.Value;
            var offer = new TutorOffer
            {
                TutorialId = input.TutorialId,
                TutorId = tutorId,
                IsAccepted = false,
                IsSubmitted = input.IsSubmitted,
                CreationTime = DateTime.UtcNow
            };

            await _tutorOffersRepository.InsertAsync(offer);
        }
    }
}
