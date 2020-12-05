using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.UI;
using Academically.Entities;
using Academically.Services.Offers.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Offers
{
    public class TutorOffersAppService : AcademicallyAppServiceBase, ITutorOffersAppService
    {
        private readonly IRepository<TutorOffer, Guid> _tutorOffersRepository;
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;

        public TutorOffersAppService(
            IRepository<TutorOffer, Guid> tutorOffersRepository,
            IRepository<UserEducation, Guid> userEducationsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository
            )
        {
            _tutorOffersRepository = tutorOffersRepository;
            _userProfilesRepository = userProfilesRepository;
            _userEducationsRepository = userEducationsRepository;
        }

        public async Task<GetTutorOfferDto> GetAsync(Guid offerId)
        {
            var offer = await _tutorOffersRepository.GetAll()
                .Where(e => e.Id == offerId)
                .Include(e => e.Tutor)
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
            var tutor = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
            var offer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.TutorialId == input.TutorialId && e.TutorId == tutor.Id);
            
            if (offer == null)
            {
                offer = new TutorOffer();
                offer.CreationTime = DateTime.UtcNow;
                offer.TutorId = tutor.Id;
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
            var tutor = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
            var offer = await _tutorOffersRepository.GetAll()
                .Where(e => e.TutorId == tutor.Id && e.TutorialId == tutorialId)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .FirstOrDefaultAsync();

            return offer;
        }

        public async Task<IEnumerable<GetTutorOfferDto>> GetAllAsync(Guid tutorialId)
        {
            var offers = await _tutorOffersRepository.GetAll()
                .Where(e => e.TutorialId == tutorialId)
                .Include(e => e.Tutor)
                    .ThenInclude(e => e.User)
                        .ThenInclude(e => e.UserDisciplineTaxonomies)
                            .ThenInclude(e => e.DisciplineTaxonomy)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .ToListAsync();

            return offers;
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
