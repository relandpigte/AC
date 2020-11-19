using Abp.Configuration;
using Abp.Domain.Repositories;
using Academically.Application.Shared.Services;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Entities;
using Academically.Services.Offers.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
            var offer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.TutorialId == input.TutorialId && e.TutorId == tutorId);

            if(offer == null)
            {
                offer = new TutorOffer();
                offer.TutorId = tutorId;
            }

            ObjectMapper.Map(input, offer);
            
            await _tutorOffersRepository.InsertOrUpdateAsync(offer);
        }

        public async Task<GetTutorOfferDto> GetAsync(Guid tutorialId)
        {
            var offer = await _tutorOffersRepository.GetAll()
                .Where(e => e.TutorId == AbpSession.UserId.Value && e.TutorialId == tutorialId)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .FirstOrDefaultAsync();

            return offer;
        }
    }
}
