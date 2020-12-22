using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Academically.Entities;
using Academically.Services.Offers.Dto;
using GeoCoordinatePortable;
using Microsoft.EntityFrameworkCore;
using Academically.Application.Shared.Services;
using Academically.Configuration;
using Academically.Entities.Enums;
using System.Collections.Generic;
using Academically.Services.UserSessions.Dto;
using Academically.Services.UserProfiles.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Offers
{
    public class TutorOffersAppService : AcademicallyAppServiceBase, ITutorOffersAppService
    {
        private const double METER_TO_MILE_CONVERSION = 0.00062137;

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

        public async Task SaveAsync(CreateTutorOfferDto input)
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

        public async Task<PagedResultDto<GetTutorOfferDto>> GetAllAsync(PagedAndSortedTutorOfferResultRequestDto input)
        {
            var offersQuery = _tutorOffersRepository.GetAll()
                .Include(e => e.Tutor)
                    .ThenInclude(e => e.User)
                        .ThenInclude(e => e.UserDisciplineTaxonomies)
                            .ThenInclude(e => e.DisciplineTaxonomy)
                .Include(e => e.Sessions)
                .Where(e => e.TutorialId == input.TutorialIdFilter)
                .Where(e => !e.Sessions.Any(s => s.Status == SessionStatus.Pending || s.Status == SessionStatus.Confirmed))
                .WhereIf(input.EducationLevelFilter.HasValue, e => e.Tutor.User.UserEducations.Any(t => t.Level >= input.EducationLevelFilter.Value));

            var allOffers = await offersQuery.Select(e => ObjectMapper.Map<GetTutorOfferDto>(e)).ToListAsync();

            var currentUserProfile = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
            if (currentUserProfile == null)
            {
                throw new UserFriendlyException(L("AddressNotDefinedErrorMessage"));
            }
            var userLocationCoordinate = new GeoCoordinate(currentUserProfile.Latitude ?? 0, currentUserProfile.Longitude ?? 0);

            var allOffersQuery = allOffers.Select(e => new
            {
                to = e,
                gc = (new GeoCoordinate(e.Tutor.Latitude ?? 0, e.Tutor.Longitude ?? 0).GetDistanceTo(userLocationCoordinate)) * METER_TO_MILE_CONVERSION
            })
            .WhereIf(input.DistanceFilter.HasValue, e => e.gc <= input.DistanceFilter.Value)
            .OrderBy(e => e.gc)
            .Select(e => e.to)
            .AsQueryable();

            var totalOffersCount = allOffersQuery.Count();

            var offers = allOffersQuery
                .PageBy(input)
                .Take(input.MaxResultCount)
                .ToList();


            return new PagedResultDto<GetTutorOfferDto>(totalOffersCount, offers);
        }

        public async Task<int> GetTutorHighestEducationLevel(long userId)
        {
            var educationLevel = await _userEducationsRepository.GetAll()
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Level)
                .Select(e => (int)e.Level)
                .FirstOrDefaultAsync();


            return educationLevel;
        }

        public async Task<GetTutorOfferDto> GetTutorOfferSessionsAsync(Guid tutorialId)
        {
            var tutor = await _userProfilesRepository.FirstOrDefaultAsync(e => e.UserId == AbpSession.UserId.Value);
            var offer = await _tutorOffersRepository.GetAll()
                .Include(e => e.Sessions)
                    .ThenInclude(e => e.TutorOffer)
                        .ThenInclude(e => e.Tutorial)
                            .ThenInclude(e => e.Student) 
                .Where(e => e.TutorId == tutor.Id && e.TutorialId == tutorialId)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .FirstOrDefaultAsync();

            if (offer != null)
            {
                foreach (var session in offer.Sessions)
                {
                    session.TimeZone = TimeZoneInfo.FindSystemTimeZoneById(session.TutorOffer.Tutorial.Student.TimezoneId).DisplayName;
                }

                return offer;
            }

            return new GetTutorOfferDto();
        }

        public async Task<IEnumerable<GetTutorOfferDto>> GetAllTutorOfferSessionsAsync(Guid tutorialId)
        {
            var offer = await _tutorOffersRepository.GetAll()
                .Include(e => e.Sessions)
                    .ThenInclude(e => e.TutorOffer)
                        .ThenInclude(e => e.Tutor)
                            .ThenInclude(e => e.User)
                .Where(e => e.TutorialId == tutorialId)
                .Select(e => ObjectMapper.Map<GetTutorOfferDto>(e))
                .ToListAsync();

            return offer;
        }
    }
}
