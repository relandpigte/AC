using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.Offers.Dto;
using Academically.Services.UserProfiles.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Offers
{
    public class TutorOffersAppService : AcademicallyAppServiceBase, ITutorOffersAppService
    {
        private readonly IRepository<TutorOffer, Guid> _tutorOffersRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;

        public TutorOffersAppService(
            IRepository<TutorOffer, Guid> tutorOffersRepository,
            IRepository<UserProfile, Guid> userProfilesRepository
            )
        {
            _tutorOffersRepository = tutorOffersRepository;
            _userProfilesRepository = userProfilesRepository;
        }

        public async Task CreateAsync(CreateTutorOfferDto input)
        {
            var tutorId = AbpSession.UserId.Value;
            var offer = await _tutorOffersRepository.FirstOrDefaultAsync(e => e.TutorialId == input.TutorialId && e.TutorId == tutorId);

            if (offer == null)
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

        public async Task<IEnumerable<GetTutorOfferDto>> GetAllAsync(Guid tutorialId)
        {
            var offers = await _tutorOffersRepository.GetAll()
                .Where(e => e.TutorialId == tutorialId)
                .Include(e => e.Tutor)
                    .ThenInclude(e => e.UserDisciplineTaxonomies)
                        .ThenInclude(e => e.DisciplineTaxonomy)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .ToListAsync();

            foreach (var offer in offers)
            {
                offer.TutorProfile = await _userProfilesRepository.GetAll()
                    .Where(e => e.UserId == offer.Tutor.Id)
                    .Select(e => ObjectMapper.Map<UserProfileDto>(e))
                    .FirstOrDefaultAsync();
            }

            return offers;
        }
    }
}
