using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.UI;
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
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        public TutorOffersAppService(
            IRepository<TutorOffer, Guid> tutorOffersRepository,
            IRepository<UserEducation, Guid> userEducationsRepository)
        {
            _tutorOffersRepository = tutorOffersRepository;
            _userEducationsRepository = userEducationsRepository;
        }

        public async Task<GetTutorOfferDto> GetAsync(Guid offerId)
        {
            var offer = await _tutorOffersRepository.GetAll()
                .Where(e => e.Id == offerId)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .FirstOrDefaultAsync();

            if (offer.IsAccepted.HasValue && offer.IsAccepted.Value)
            {
                throw new UserFriendlyException(L("HaveExistingTutorialRequestOfferAccepted"));
            }

            return offer;
        }

        public async Task CreateAsync(CreateTutorOfferDto input)
        {
            var tutorId = AbpSession.UserId.Value;
            var offer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.TutorialId == input.TutorialId && e.TutorId == tutorId);
            
            if(offer == null)
            {
                offer = new TutorOffer();
                offer.CreationTime = DateTime.UtcNow;
                offer.TutorId = tutorId;
            }

            ObjectMapper.Map(input, offer);
            
            await _tutorOffersRepository.InsertOrUpdateAsync(offer);
        }

        public async Task<bool> AcceptOfferAsync(Guid offerId, bool isAccepted)
        {
            var offer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.Id == offerId);
            var offerResult = new GetTutorOfferDto();
            if (offer != null && offer.IsAccepted.HasValue)
            {
                throw new UserFriendlyException(L("HaveExistingTutorialRequestOfferAccepted"));
            }

            offer.IsAccepted = isAccepted;
            offer.AcceptedDate = DateTime.UtcNow;
            await _tutorOffersRepository.UpdateAsync(offer);

            return offer.IsAccepted.Value;
        }

        public async Task<GetTutorOfferDto> GetOfferAsync(Guid tutorialId)
        {
            var offer = await _tutorOffersRepository.GetAll()
                .Where(e => e.TutorId == AbpSession.UserId.Value && e.TutorialId == tutorialId)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .FirstOrDefaultAsync();

            return offer;
        }

        public async Task<int> GetTutorHighestEducationLevel(long userId)
        {
            var educationLevel = await _userEducationsRepository.GetAll()
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Level)
                .Select(e => (int) e.Level)
                .FirstOrDefaultAsync();


            return educationLevel;
        }
    }
}
