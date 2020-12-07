using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.Offers.Dto;
using Academically.Services.UserProfiles.Dto;
using Microsoft.EntityFrameworkCore;
using Academically.Application.Shared.Services;
using Academically.Configuration;

namespace Academically.Services.Offers
{
    public class TutorOffersAppService : AcademicallyAppServiceBase, ITutorOffersAppService
    {
        private readonly IRepository<TutorOffer, Guid> _tutorOffersRepository;
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        private readonly IRepository<UserProfile, Guid> _userProfilesRepository;
        private readonly IFileManagerService _fileManagerService;

        public TutorOffersAppService(
            IRepository<TutorOffer, Guid> tutorOffersRepository,
            IRepository<UserEducation, Guid> userEducationsRepository,
            IRepository<UserProfile, Guid> userProfilesRepository,
            IFileManagerService fileManagerService
            )
        {
            _tutorOffersRepository = tutorOffersRepository;
            _userProfilesRepository = userProfilesRepository;
            _userEducationsRepository = userEducationsRepository;
            _fileManagerService = fileManagerService;
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
            
            if (offer == null)
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
                    .Where(e => e.UserId == offer.TutorId)
                    .Select(e => ObjectMapper.Map<UserProfileDto>(e))
                    .FirstOrDefaultAsync();
                offer.TutorProfile.ProfilePictureFileName = _fileManagerService.GetFileUrl(offer.TutorProfile.ProfilePictureFileName, offer.TutorProfile.UserId, AppSettingNames.Aws_S3_Folders_ProfilePictures);
            }

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
