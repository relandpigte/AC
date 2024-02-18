using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Timing;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Hubs;
using Academically.Services.Posts;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Runtime.Session;
using Academically.Domain.Services.Documents;
using Academically.Extensions;
using Academically.Services.StudentCourses;
using System.Dynamic;
using System.IO;
using System.Linq.Dynamic.Core;
using Abp.Application.Services.Dto;
using Abp.Configuration;
using Abp.Timing.Timezone;
using Academically.Services.Coachings.Dto;
using Academically.Services.TimeZones;
using Academically.Services.TimeZones.Dto;
using Academically.Services.UserAvailabilities;
using Academically.Services.UserAvailabilities.Dto;
using Academically.Services.UserFollowers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Academically.Services.Services
{
    public class ServicesAppService : AcademicallyAppServiceBase, IServicesAppService
    {
        private readonly IRepository<Service, Guid> _servicesRepository;
        private readonly IRepository<ServiceMapping, Guid> _serviceMappingsRepository;
        private readonly IRepository<Service2, Guid> _service2sRepository;
        private readonly IRepository<ServicePurchase, Guid> _servicePurchasesRepository;
        private readonly IRepository<ServiceOffer, Guid> _serviceOffersRepository;
        private readonly IPostsAppService _postsAppService;
        private readonly IHubManager _hubManager;
        private readonly IStudentCoursesAppService _studentCoursesAppService;
        private readonly IRepository<ServiceBooking, Guid> _serviceBooking;
        private readonly IRepository<ServiceReview, Guid> _serviceReviewRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<Coaching, Guid> _coachingsRepository;
        private readonly IRepository<Event, Guid> _eventsRepository;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<Video, Guid> _videosRepository;
        private readonly IRepository<Notification, Guid> _notificationsRepository;
        private readonly IHubContext<EventsHub> _eventsHub;
        private readonly IUserAvailabilitiesAppService _userAvailabilitiesAppService;
        private readonly ITimeZonesAppService _timeZonesAppService;
        private readonly ISettingManager _settingManager;
        private readonly IRepository<ServiceFeatureFlag, Guid> _serviceFeatureFlagRepository;
        private readonly IRepository<ServiceActivity, Guid> _serviceActivityRepository;
        private readonly IServicePollsAppService _servicePollsAppService;
        private readonly IServiceQuizesAppService _serviceQuizesAppService;
        private readonly IRepository<ServicePresentation, Guid> _servicePresentationRepository;
        private readonly IRepository<ServiceHandout, Guid> _serviceHandoutRepository;

        private readonly List<Service2Dto> StaticServiceLevels = new List<Service2Dto>
            {
                new Service2Dto {
                    Id = Guid.Parse("cbe3067b-c6c6-4d01-9cbe-4ec7dc94cf18"),
                    Name = "High School",
                    ParentIdMap = "cbe3067b-c6c6-4d01-9cbe-4ec7dc94cf18",
                },
                new Service2Dto {
                    Id = Guid.Parse("552cbaae-aeeb-4745-99b0-fd92da9c7288"),
                    Name = "Pre Degree",
                    ParentIdMap = "552cbaae-aeeb-4745-99b0-fd92da9c7288",
                },
                new Service2Dto
                {
                    Id = Guid.Parse("efd532fd-198b-4364-9be3-5dfdc299ed63"),
                    Name = "Undergraduate",
                    ParentIdMap = "efd532fd-198b-4364-9be3-5dfdc299ed63",
                },
                new Service2Dto
                {
                    Id = Guid.Parse("173b478d-cffe-4b57-9b5e-4cd54a006dc4"),
                    Name = "Graduate",
                    ParentIdMap = "173b478d-cffe-4b57-9b5e-4cd54a006dc4",
                },
                new Service2Dto
                {
                    Id = Guid.Parse("0aff0178-03c7-4b75-b74a-596378427dd7"),
                    Name = "Post Graduate",
                    ParentIdMap = "0aff0178-03c7-4b75-b74a-596378427dd7",
                },
                new Service2Dto
                {
                    Id = Guid.Parse("36680967-d2a9-4e9d-807e-4cce793a6aac"),
                    Name = "Doctorate",
                    ParentIdMap = "36680967-d2a9-4e9d-807e-4cce793a6aac",
                },
            };
        private readonly List<Service2Dto> StaticServices = new List<Service2Dto>
            {
                new Service2Dto {
                    Id = Guid.Parse("7483d3c9-84c4-4a38-9b37-8783e19af7e4"),
                    Name = "Academic Tutoring",
                    ParentIdMap = "7483d3c9-84c4-4a38-9b37-8783e19af7e4",
                    Description = "Improve your subject knowledge from talented tutors"
                },
                new Service2Dto {
                    Id = Guid.Parse("7585ab65-4087-4c73-a0ee-821bf670943f"),
                    Name = "Assignment Feedback",
                    ParentIdMap = "7585ab65-4087-4c73-a0ee-821bf670943f",
                    Description = "Receive unbiased feedback before you submit your work"
                },
            };

        public ServicesAppService(
            IRepository<Service, Guid> servicesRepository,
            IRepository<ServiceMapping, Guid> serviceMappingsRepository,
            IRepository<Service2, Guid> service2sRepository,
            IRepository<ServicePurchase, Guid> servicePurchasesRepository,
            IRepository<ServiceOffer, Guid> serviceOffersRepository,
            IPostsAppService postsAppService,
            IHubManager hubManager,
            IStudentCoursesAppService studentCoursesAppService,
            IRepository<ServiceBooking, Guid> serviceBooking,
            IRepository<ServiceReview, Guid> serviceReviewRepository,
            IDocumentsDomainService documentsDomainService,
            IRepository<Coaching, Guid> coachingsRepository,
            IRepository<Event, Guid> eventsRepository,
            IRepository<Notification, Guid> notificationsRepository,
            IHubContext<EventsHub> eventsHub,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Course, Guid> coursesRepository,
            IRepository<Video, Guid> videosRepository,
            IUserAvailabilitiesAppService userAvailabilitiesAppService,
            ITimeZonesAppService timeZonesAppService,
            ISettingManager settingManager,
            IRepository<ServiceFeatureFlag, Guid> serviceFeatureFlagRepository,
            IRepository<ServiceActivity, Guid> serviceActivityRepository,
            IServicePollsAppService servicePollsAppService,
            IServiceQuizesAppService serviceQuizesAppService,
            IRepository<ServicePresentation, Guid> servicePresentationRepository,
            IRepository<ServiceHandout, Guid> serviceHandoutRepository)
        {
            _servicesRepository = servicesRepository;
            _serviceMappingsRepository = serviceMappingsRepository;
            _service2sRepository = service2sRepository;
            _servicePurchasesRepository = servicePurchasesRepository;
            _serviceOffersRepository = serviceOffersRepository;
            _postsAppService = postsAppService;
            _hubManager = hubManager;
            _studentCoursesAppService = studentCoursesAppService;
            _serviceBooking = serviceBooking;
            _serviceReviewRepository = serviceReviewRepository;
            _documentsDomainService = documentsDomainService;
            _coachingsRepository = coachingsRepository;
            _eventsRepository = eventsRepository;
            _notificationsRepository = notificationsRepository;
            _eventsHub = eventsHub;
            _articlesRepository = articlesRepository;
            _coursesRepository = coursesRepository;
            _videosRepository = videosRepository;
            _userAvailabilitiesAppService = userAvailabilitiesAppService;
            _timeZonesAppService = timeZonesAppService;
            _settingManager = settingManager;
            _serviceFeatureFlagRepository = serviceFeatureFlagRepository;
            _serviceActivityRepository = serviceActivityRepository;
            _servicePollsAppService = servicePollsAppService;
            _serviceQuizesAppService = serviceQuizesAppService;
            _servicePresentationRepository = servicePresentationRepository;
            _serviceHandoutRepository = serviceHandoutRepository;
        }

        public async Task TestEventNotifierToasters(string ids)
        {
            var now = Clock.Now;
            var targetDate = now.AddMinutes(2440);

            var idsToGet = ids.Split(",");

            var candidateBookings = await this._serviceBooking.GetAll()
               .AsNoTracking()
               //.Where(b => b.BookingDateTime >= now && b.BookingDateTime <= targetDate)
               .Where(b => idsToGet.Any(i => i == b.Id.ToString()))
               .ToListAsync();

            if (candidateBookings != null && candidateBookings.Count > 0)
            {
                await CheckUpcomingCoachings(candidateBookings);
                await CheckUpcomingWorkshops(candidateBookings);
                await CheckUpcomingBroadcasts(candidateBookings);
            }
        }

        private async Task CheckUpcomingCoachings(List<ServiceBooking> bookings)
        {
            var candidateBookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var candidateCoachings = await _coachingsRepository.GetAll()
                     .AsNoTracking()
                     .Include(c => c.CreatorUser)
                     .Where(c => candidateBookingIds.Any(i => i == c.Id))
                     .ToListAsync();

            foreach (var coaching in candidateCoachings)
            {
                try
                {
                    var booking = bookings.SingleOrDefault(b => b.ReferenceId == coaching.Id);
                    var obj = new ExpandoObject();
                    obj.TryAdd("Booking", booking);
                    obj.TryAdd("Data", coaching);
                    await this._eventsHub.Clients.Group($"{booking.CreatorUserId}").SendAsync(nameof(HubEvent.UpcomingEvent), obj);
                }
                catch (ArgumentNullException ex)
                {
                }

            }
        }

        private async Task CheckUpcomingWorkshops(List<ServiceBooking> bookings)
        {
            var candidateBookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var candidateWorkshops = await _eventsRepository.GetAll()
                    .AsNoTracking()
                    .Include(c => c.CreatorUser)
                    .Where(w => w.Category == EventCategory.Workshop)
                    .Where(c => candidateBookingIds.Any(i => i == c.Id))
                    .ToListAsync();

            foreach (var workshop in candidateWorkshops)
            {
                try
                {
                    var booking = bookings.SingleOrDefault(b => b.ReferenceId == workshop.Id);
                    var obj = new ExpandoObject();
                    obj.TryAdd("Booking", booking);
                    obj.TryAdd("Data", workshop);
                    await this._eventsHub.Clients.Group($"{booking.CreatorUserId}").SendAsync(nameof(HubEvent.UpcomingEvent), obj);
                }
                catch (ArgumentNullException ex)
                {
                }
            }
        }

        private async Task CheckUpcomingBroadcasts(List<ServiceBooking> bookings)
        {
            var candidateBookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var candidateBroadcasts = await _eventsRepository.GetAll()
                    .AsNoTracking()
                    .Include(c => c.CreatorUser)
                    .Where(w => w.Category == EventCategory.Broadcast)
                    .Where(c => candidateBookingIds.Any(i => i == c.Id))
                    .ToListAsync();

            foreach (var broadcast in candidateBroadcasts)
            {
                try
                {
                    var booking = bookings.SingleOrDefault(b => b.ReferenceId == broadcast.Id);
                    var obj = new ExpandoObject();
                    obj.TryAdd("Booking", booking);
                    obj.TryAdd("Data", broadcast);
                    await this._eventsHub.Clients.Group($"{booking.CreatorUserId}").SendAsync(nameof(HubEvent.UpcomingEvent), obj);
                }
                catch (ArgumentNullException ex)
                {
                }
            }
        }

        public async Task<IEnumerable<ServiceDto>> GetCategories()
        {
            var categoryIds = await _serviceMappingsRepository.GetAll()
                .Select(e => e.Node1Id)
                .Distinct()
                .ToListAsync();

            var categories = await _servicesRepository.GetAll()
                .Where(e => categoryIds.Any(id => id == e.Id))
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ServiceDto>(e))
                .ToListAsync();

            return categories;
        }

        public async Task<IEnumerable<ServiceDto>> GetServices(Guid categoryId)
        {
            var serviceIds = await _serviceMappingsRepository.GetAll()
                .Where(e => e.Node1Id == categoryId && e.Node3Id == null)
                .Select(e => e.Node2Id)
                .Distinct()
                .ToListAsync();

            var services = await _servicesRepository.GetAll()
                .Where(e => serviceIds.Any(id => id == e.Id))
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ServiceDto>(e))
                .ToListAsync();

            return services;
        }

        public async Task<IEnumerable<ServiceMappingDto>> GetLevels(Guid categoryId, Guid serviceId)
        {
            var serviceMappings = await _serviceMappingsRepository.GetAll()
                .Where(e => e.Node1Id == categoryId && e.Node2Id == serviceId && e.Node3Id != null)
                .Include(e => e.Service)
                .Distinct()
                .OrderBy(e => e.Service.Name)
                .Select(e => ObjectMapper.Map<ServiceMappingDto>(e))
                .ToListAsync();

            return serviceMappings;
        }

        public async Task<IEnumerable<SubjectDto>> GetSubjects(string levelName)
        {
            var levelIds = await _servicesRepository.GetAll()
                .Where(e => e.Name.Equals(levelName))
                .Select(e => e.Id)
                .ToListAsync();

            return await _servicesRepository.GetAll()
                .Where(e => levelIds.Any(id => id == e.Id))
                .SelectMany(e => e.ServiceSubjects)
                .Where(e => e.Subject.ReviewStatus == SubjectReviewStatus.Approved
                    || (e.Subject.ReviewStatus != SubjectReviewStatus.Rejected && e.Subject.CreatorUserId == AbpSession.UserId.Value))
                .Select(e => ObjectMapper.Map<SubjectDto>(e.Subject))
                .Distinct()
                .ToListAsync();
        }

        // Using Service2 Table
        public async Task<IEnumerable<Service2Dto>> GetAllCategories()
        {
            return await _service2sRepository.GetAll()
                .OrderBy(s => s.Name)
                .Select(s => ObjectMapper.Map<Service2Dto>(s))
                .ToListAsync();
        }

        public IEnumerable<Service2Dto> GetStaticServiceLevels()
        {
            return StaticServiceLevels;
        }

        public IEnumerable<Service2Dto> GetStaticServices()
        {
            return StaticServices;
        }

        public async Task<ServicePurchaseDto> GetPurchase(Guid id)
        {
            var purchase = await this._servicePurchasesRepository.GetAll()
                .Include(p => p.CreatorUser)
                .FirstOrDefaultAsync(p => p.Id == id);
            if (purchase != null)
            {
                return ObjectMapper.Map<ServicePurchaseDto>(purchase);
            }
            return null;
        }

        public async Task<IEnumerable<ServicePurchaseDto>> GetAllPurchases(Guid? referenceId, long? userId)
        {
            var purchases = this._servicePurchasesRepository.GetAll()
                .Include(p => p.CreatorUser)
                    .ThenInclude(x => x.ProfilePictureDocument)
                .WhereIf(referenceId.HasValue, p => p.ReferenceId == referenceId.Value)
                .WhereIf(userId.HasValue, p => p.CreatorUserId == userId.Value)
                .Select(p => ObjectMapper.Map<ServicePurchaseDto>(p))
                .ToList();
            return purchases;
        }

        public async Task<ServicePurchaseDto> GetPurchasedByReference(Guid referenceId)
        {
            return await _servicePurchasesRepository.GetAll()
                .Include(p => p.CreatorUser)
                    .ThenInclude(x => x.ProfilePictureDocumentId)
                .Where(x => x.ReferenceId == referenceId)
                .Where( x => x.CreatorUserId == AbpSession.GetUserId())
                .Select(x => ObjectMapper.Map<ServicePurchaseDto>(x))
                .FirstOrDefaultAsync();
        }
        
        public async Task<ServicePurchaseDto> SavePurchase(CreateServicePurchaseDto input)
        {
            ServiceOffer offer = null;

            if (input.ServiceOfferId.HasValue)
            {
                offer = await this._serviceOffersRepository.GetAsync(input.ServiceOfferId.Value);
                if (!this.IsOfferActive(offer)) return null;
            }
            
            if (input.Id.HasValue)
            {
                var existing = await this._servicePurchasesRepository.GetAsync(input.Id.Value);
                if (existing != null)
                {
                    existing.ReferenceId = input.ReferenceId;
                    existing.ServiceOfferId = input.ServiceOfferId;
                    existing.CreatorUserId = input.CreatorUserId;
                    existing.CreationTime = Clock.Now;

                    return await this.GetPurchase(existing.Id);
                }
            }

            input.CreationTime = Clock.Now;

            var created = ObjectMapper.Map<ServicePurchaseDto>(await this._servicePurchasesRepository.InsertAsync(ObjectMapper.Map<ServicePurchase>(input)));

            if (offer != null)
            {
                offer.SoldCount = offer.SoldCount + 1;
            }

            await CreateStudentServiceRecords(created.ReferenceId.Value, created.Type.Value);
            return await this.GetPurchase(created.Id);
        }
        
        public async Task<ServiceBookingDto> SaveBooking(CreateServiceBookingDto input)
        {
            var serviceBooking = ObjectMapper.Map<ServiceBooking>(input);
            var service = await _serviceBooking.InsertOrUpdateAsync(serviceBooking);
            return ObjectMapper.Map<ServiceBookingDto>(service);
        }
        
        public async Task<ServiceBookingDto> GetBookingDetails(Guid referenceId, long userId)
        {
            return await _serviceBooking.GetAll()
                .Where(x => x.CreatorUserId == userId)
                .Where(x => x.ReferenceId == referenceId)
                .OrderByDescending(x => x.BookingDateTime)
                .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceBookingDto> CancelBooking(CancelServiceBookingDto input)
        {
            var existing = input.Id.HasValue ? await _serviceBooking.GetAsync(input.Id.Value) : await _serviceBooking.GetAll()
                .Where(s => s.ReferenceId == input.ReferenceId)
                .Where(s => s.CreatorUserId == AbpSession.GetUserId())
                .SingleOrDefaultAsync();

            if (existing != null)
            {
                existing.CancellationReason = input.CancellationReason;
                existing.CancellationTime = input.CancellationTime;
                existing.UserCancelled = input.UserCancelled;
            }

            return ObjectMapper.Map<ServiceBookingDto>(existing);
        }

        public async Task<IEnumerable<ServiceBookingDto>> GetAllBookings(Guid? referenceId, long? ownerId)
        {
            return _serviceBooking.GetAll()
                .WhereIf(referenceId.HasValue, x => x.ReferenceId == referenceId)
                .WhereIf(ownerId.HasValue, x => x.OwnerId == ownerId)
                .Where(x => x.CancellationTime.Equals(null))
                .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                .ToList();
        }

        public async Task<ServiceBookingDto> GetBookingAsync(Guid bookingId)
        {
            return await _serviceBooking.GetAll()
                .Where(x => x.Id == bookingId)
                .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                .SingleOrDefaultAsync();
        }

        public async Task<ServiceBookingDto> GetBookingByReferenceId(Guid referenceId)
        {
            return await _serviceBooking.GetAll()
               .Where(x => x.CreatorUserId == this.AbpSession.UserId)
               .Where(x => x.ReferenceId == referenceId)
               .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
               .SingleOrDefaultAsync();
        }
        
        public async Task<List<DateTime?>> GetCoachingSchedules(long serviceUserId, Guid serviceId, int year, int month)
        {
            var serviceBookings = await GetAllBookings(serviceId, serviceUserId);
            var availability = (await _userAvailabilitiesAppService.GetAll(serviceUserId)).ToList();
            var availabilitySetting = await _userAvailabilitiesAppService.GetAvailabilitySettings(serviceUserId);
            var coachTimezoneId = await _settingManager.GetSettingValueForUserAsync(TimingSettingNames.TimeZone, AbpSession.GetTenantId(), serviceUserId);
            var userTimezoneId = await _settingManager.GetSettingValueForUserAsync(TimingSettingNames.TimeZone, AbpSession.GetTenantId(), AbpSession.GetUserId());
            var days = DateTime.DaysInMonth(year, month);
            var bookings = serviceBookings.Where(x => x.CreatorUserId != AbpSession.GetUserId())
                .Select(x => ConvertBookingDateTimezoneToLocal(coachTimezoneId, userTimezoneId, x.BookingDateTime).ToString()).ToList();
            
            var response = new List<DateTime?>();
            for (var day = 1; day <= days; day++)
            {
                var d = new DateTime(year, month, day);
                var customSchedules = GetSchedules(availability, d, true);
                var defaultSchedules = GetSchedules(availability, d);
                var schedules = customSchedules.Count > 0 ? customSchedules : defaultSchedules;
                var schedule = schedules.First();
                var breaks = schedules.Where(s => s.Id != schedule.Id).ToList();
                
                if (Clock.Now.Date > d.Date || !schedule.IsAvailable) continue;

                var bookingStartDate = ConstructBookingDate(coachTimezoneId, userTimezoneId, d, schedule.StartTime);
                var bookingEndDate = ConstructBookingDate(coachTimezoneId, userTimezoneId, d, schedule.EndTime);
                var currentDateTime = bookingStartDate;
                
                while (currentDateTime <= bookingEndDate)
                {
                    var paddingApplicable = false;
                    var isBreakTime = breaks.Any(x =>
                    {
                        var start = ConstructBookingDate(coachTimezoneId, userTimezoneId, d, x.StartTime);
                        var end = ConstructBookingDate(coachTimezoneId, userTimezoneId, d, x.EndTime);
                        return start < currentDateTime && currentDateTime < end;
                    });
                    if (!CheckAvailabilitySchedule(currentDateTime.Value, availabilitySetting) && !isBreakTime && currentDateTime > Clock.Now)
                    {
                        if (!bookings.Contains(currentDateTime.ToString())) response.Add(currentDateTime);
                        else paddingApplicable = true;
                    }
                    currentDateTime = currentDateTime.Value.AddMinutes(availabilitySetting.BookingIntervals + (paddingApplicable ? availabilitySetting.Padding : 0));
                }
            }
            return response;
        }

        private static List<UserAvailabilityDto> GetSchedules(IEnumerable<UserAvailabilityDto> availability, DateTime date, bool custom = false)
        {
            return availability.WhereIf(custom, x => x.SpecificDate != null && x.SpecificDate.Value.Date == date.Date)
                .WhereIf(!custom, x => x.DayOfWeek == date.DayOfWeek)
                .OrderBy(x => x.StartTime)
                .ToList();
        }

        private static DateTime? ConstructBookingDate(string coachTimezoneId, string userTimezoneId, DateTime date, string time)
        {
            return coachTimezoneId == userTimezoneId ? date + TimeOnly.Parse(time).ToTimeSpan() :
                TimezoneHelper.Convert(date + TimeOnly.Parse(time).ToTimeSpan(), coachTimezoneId, userTimezoneId);
        }

        private static DateTime? ConvertBookingDateTimezoneToLocal(string coachTimezoneId, string userTimezoneId, DateTime date)
        {
            return coachTimezoneId == userTimezoneId ? date : TimezoneHelper.Convert(date, coachTimezoneId, userTimezoneId);
        }

        private static bool CheckAvailabilitySchedule(DateTime date, UserAvailabilitySetting availabilitySettings)
        {
            var isMinimumBooking = availabilitySettings.IsMinimumBookingNotice;
            var minimumBooking = availabilitySettings.MinimumBookingNotice;
            var minimumBookingUnit = availabilitySettings.MinimumBookingNoticeUnit;
            if (isMinimumBooking && minimumBooking > 0 )
            {
                var minimumBookingDate = GetDateTimeByUnit(minimumBookingUnit, minimumBooking);
                if (minimumBookingDate >= date) return true;
            }
            
            var isMaximumBooking = availabilitySettings.IsMaximumAdvanceNotice;
            var maximumBooking = availabilitySettings.MaximumAdvanceNotice;
            var maximumBookingUnit = availabilitySettings.MaximumAdvanceNoticeUnit;
            if (isMaximumBooking && maximumBooking > 0 )
            {
                var maximumBookingDate = GetDateTimeByUnit(maximumBookingUnit, maximumBooking);
                if (maximumBookingDate <= date) return true;
            }
            return false;
        }

        private static DateTime GetDateTimeByUnit(AvailabilityUnit unit, int minimumBooking)
        {
            var now = Clock.Now;
            return unit switch
            {
                AvailabilityUnit.Minutes => now.AddMinutes(minimumBooking),
                AvailabilityUnit.Hours => now.AddHours(minimumBooking),
                AvailabilityUnit.Days => now.AddDays(minimumBooking),
                _ => throw new ArgumentOutOfRangeException()
            };
        }
        
        private async Task CreateStudentServiceRecords(Guid id, ServicesType type)
        {
            switch (type)
            {
                case ServicesType.Course:
                    await _studentCoursesAppService.Create(id);
                    break;
            }
        }

        private bool IsOfferActive(ServiceOffer offer)
        {
            if (offer == null) return false;
            if (offer.Status != ServiceOfferStatus.Open) return false;
            if (offer.LaunchedTime == null) return false;
            if (offer.IsNumberOfUnitsLimited)
            {
                if ((offer.Purchases?.Count ?? 0) >= offer.UnitLimit) return false;
            }
            if (offer.IsOfferDurationLimited)
            {
                var endTime = offer.LaunchedTime.Value.AddDays((double)offer.OfferLimitDays).AddHours((double)offer.OfferLimitHours).AddMinutes((double)offer.OfferLimitMinutes);
                if (endTime < Clock.Now) return false;
            }
            return true;
        }

        public async Task<ServiceOfferDto> UpsertServiceOffer(CreateServiceOfferDto input)
        {
            if (input.Id.HasValue)
            {
                var existing = await this._serviceOffersRepository.GetAsync(input.Id.Value);
                if (existing != null)
                {
                    existing.ServiceId = input.ServiceId;
                    existing.PercentageDiscount = input.PercentageDiscount;
                    existing.DiscountAmount = input.DiscountAmount;
                    existing.IsOfferDurationLimited = input.IsOfferDurationLimited;
                    existing.OfferLimitDays = input.OfferLimitDays;
                    existing.OfferLimitHours = input.OfferLimitHours;
                    existing.OfferLimitMinutes = input.OfferLimitMinutes;
                    existing.IsNumberOfUnitsLimited = input.IsNumberOfUnitsLimited;
                    existing.UnitLimit = input.UnitLimit;

                    var existingDto = ObjectMapper.Map<ServiceOfferDto>(existing);
                    existingDto.Service = await this._postsAppService.GetService(existingDto.ServiceId);
                    return existingDto;
                }
            }
            var upserted = ObjectMapper.Map<ServiceOfferDto>(await this._serviceOffersRepository.InsertAsync(ObjectMapper.Map<ServiceOffer>(input)));
            upserted.Service = await this._postsAppService.GetService(upserted.ServiceId);
            return upserted;
        }

        public async Task<IEnumerable<ServiceOfferDto>> GetServiceOffers(Guid referenceId, ServiceOfferStatus? status, bool? isPurchased)
        {
            var currentUserId = this.AbpSession.UserId;
            var offers = this._serviceOffersRepository.GetAll()
                .Include(o => o.Purchases)
                    .ThenInclude(p => p.CreatorUser)
                .Where(o => o.ReferenceId == referenceId)
                .WhereIf(status.HasValue, o => o.Status == status.Value)
                .WhereIf(isPurchased.HasValue && isPurchased == true, o => o.Purchases.Any(p => p.CreatorUserId == currentUserId))
                .WhereIf(isPurchased.HasValue && isPurchased == false, o => !o.Purchases.Any(p => p.CreatorUserId == currentUserId))
                .Select(o => ObjectMapper.Map<ServiceOfferDto>(o))
                .ToList();

            foreach (var o in offers)
                o.Service = await this._postsAppService.GetService(o.ServiceId);

            return offers;
        }

        public async Task<ServiceOfferDto> GetServiceOffer(Guid Id)
        {
            var offer = await this._serviceOffersRepository.GetAll()
                .Include(o => o.Purchases)
                    .ThenInclude(p => p.CreatorUser)
                .Where(o => o.Id == Id)
                .Select(o => ObjectMapper.Map<ServiceOfferDto>(o))
                .FirstOrDefaultAsync();
            if (offer != null)
            {
                offer.Service = await this._postsAppService.GetService(offer.ServiceId);
                return offer;
            }
            return null;
        }

        public async Task<ServiceOfferDto> LaunchOffer(Guid Id)
        {
            var offer = await this._serviceOffersRepository.GetAll()
                .Include(o => o.Purchases)
                    .ThenInclude(p => p.CreatorUser)
               .Where(o => o.Id == Id)
               .FirstOrDefaultAsync();

            if (offer != null)
            {
                offer.Status = ServiceOfferStatus.Open;
                offer.LaunchedTime = DateTime.Now;
                await this._hubManager.NotifyUsersForServiceOfferLaunched(ObjectMapper.Map<ServiceOfferDto>(offer));
                return ObjectMapper.Map<ServiceOfferDto>(offer);
            }
            return null;
        }

        public async Task<ServiceOfferDto> CloseOffer(Guid Id)
        {
            var offer = await this._serviceOffersRepository.GetAll()
                .Include(o => o.Purchases)
                    .ThenInclude(p => p.CreatorUser)
               .Where(o => o.Id == Id)
               .FirstOrDefaultAsync();

            if (offer != null)
            {
                offer.Status = ServiceOfferStatus.Closed;
                offer.EndedTime = DateTime.Now;
                await this._hubManager.NotifyUsersForServiceOfferClosed(ObjectMapper.Map<ServiceOfferDto>(offer));
                return ObjectMapper.Map<ServiceOfferDto>(offer);
            }
            return null;
        }

        public async Task<IEnumerable<ServiceReviewDto>> GetServiceReviews(Guid referenceId, Guid? notificationId)
        {
            var reviews = await _serviceReviewRepository.GetAll()
                .Where(x => x.ReferenceId == referenceId)
                .Include(x => x.CreatorUser)
                .Select(x => ObjectMapper.Map<ServiceReviewDto>(x))
                .ToListAsync();

            return await GetServiceReviewDetails(reviews, notificationId);
        }

        public async Task<ServiceReview> SaveServiceReview(CreateServiceReviewDto input)
        {
            var serviceReview = ObjectMapper.Map<ServiceReview>(input);
            serviceReview.CreationTime = Clock.Now;
            return await _serviceReviewRepository.InsertAsync(serviceReview);
        }

        public async Task<ServiceReviewDto> GetUserReview(Guid referenceId)
        {
            return await _serviceReviewRepository.GetAll()
                .Where(x => x.ReferenceId == referenceId)
                .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                .Select(x => ObjectMapper.Map<ServiceReviewDto>(x))
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceReviewStats> GetServiceReviewStats(Guid referenceId)
        {
            var reviews = _serviceReviewRepository.GetAll()
                .Where(x => x.ReferenceId == referenceId);
            
            var reviewStats = new ServiceReviewStats
            {
                TotalReviews = await reviews.CountAsync()
            };

            if (reviewStats.TotalReviews.Equals(0)) return reviewStats;
            var oneStars = (await reviews.CountAsync(x => x.Rating == 1)).ToDecimal();
            var twoStars = (await reviews.CountAsync(x => x.Rating == 2)).ToDecimal();
            var threeStars = (await reviews.CountAsync(x => x.Rating == 3)).ToDecimal();
            var fourStars = (await reviews.CountAsync(x => x.Rating == 4)).ToDecimal();
            var fiveStars = (await reviews.CountAsync(x => x.Rating == 5)).ToDecimal();
            var sumRatings = (await reviews.SumAsync(x => x.Rating)).ToDecimal();

            reviewStats.OneStars = Math.Round(oneStars / reviewStats.TotalReviews * 100);
            reviewStats.TwoStars = Math.Round(twoStars / reviewStats.TotalReviews * 100);
            reviewStats.ThreeStars = Math.Round(threeStars / reviewStats.TotalReviews * 100);
            reviewStats.FourStars = Math.Round(fourStars / reviewStats.TotalReviews * 100);
            reviewStats.FiveStars = Math.Round(fiveStars / reviewStats.TotalReviews * 100);
            reviewStats.OverallRatings = Math.Round(sumRatings / reviewStats.TotalReviews, 1);
            return reviewStats;
        }

        public async Task<decimal> GetUserServicesOverallReviews(long userId)
        {
            var reviews = await _serviceReviewRepository.GetAll()
                .Where(x => x.ServiceOwnerId == userId)
                .ToListAsync();
            if (reviews.Count == 0) return 0;

            return reviews.Sum(x => x.Rating).ToDecimal() / reviews.Count;
        }

        public async Task<ServiceMetricsDto> GetServiceMetrics(long userId, ServicesType type)
        {
            var serviceMetrics = new ServiceMetricsDto
            {
                Revenue = 350855.30,
                Created = await ServiceCreatedCount(userId, type),
                Sales = 5,
                OverallReview = await GetServicesReviews(userId, type)
            };
            return serviceMetrics;
        }

        public async Task<ServiceFeatureFlagDto> SaveFeatureFlags(ServiceFeatureFlagDto input)
        {
            var flags = ObjectMapper.Map<ServiceFeatureFlag>(input);
            var serviceFlags = await _serviceFeatureFlagRepository.InsertOrUpdateAsync(flags);
            return ObjectMapper.Map<ServiceFeatureFlagDto>(serviceFlags);
        }
        
        public async Task<ServiceFeatureFlagDto> GetFeatureFlags(Guid referenceId)
        {
            return await _serviceFeatureFlagRepository.GetAll()
                .Where(x => x.ReferenceId == referenceId)
                .Select(x => ObjectMapper.Map<ServiceFeatureFlagDto>(x))
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ServiceActivityDto>> GetActivities(Guid serviceId)
        {
            var activities = await _serviceActivityRepository.GetAll()
                .Where(x => x.ServiceId == serviceId)
                .OrderBy(x => x.DisplayOrder)
                .Select(x => ObjectMapper.Map<ServiceActivityDto>(x))
                .ToListAsync();

            foreach (var activity in activities)
            {
                switch (activity.ActivityType)
                {
                    case ActivityType.Poll:
                        activity.Poll = await _servicePollsAppService.GetAsync(new EntityDto<Guid>(activity.ReferenceId));
                        break;
                    case ActivityType.Quiz:
                        activity.Quiz = await _serviceQuizesAppService.GetAsync(new EntityDto<Guid>(activity.ReferenceId));
                        break;
                }
            }
            return activities;
        }

        public async Task<ServiceActivityDto> GetActivity(Guid id)
        {
            var activity = await _serviceActivityRepository.GetAll()
                .Where(x => x.Id == id)
                .Select(x => ObjectMapper.Map<ServiceActivityDto>(x))
                .SingleOrDefaultAsync();
            
            switch (activity.ActivityType)
            {
                case ActivityType.Poll:
                    activity.Poll = await _servicePollsAppService.GetAsync(new EntityDto<Guid>(activity.ReferenceId));
                    break;
                case ActivityType.Quiz:
                    activity.Quiz = await _serviceQuizesAppService.GetAsync(new EntityDto<Guid>(activity.ReferenceId));
                    break;
            }
            return activity;
        }

        public async Task<ServiceActivityDto> SaveActivity(CreateServiceActivityDto input)
        {
            var activity = ObjectMapper.Map<ServiceActivity>(input);
            activity.DisplayOrder = await _serviceActivityRepository.CountAsync(x => x.ServiceId == input.ServiceId);
            
            var id = await _serviceActivityRepository.InsertAndGetIdAsync(activity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return await GetActivity(id);
        }
        
        public async Task UpdateServiceActivityOrder(UpdateServiceActivityOrder[] input)
        {
            if (input == null) return;
            foreach (var i in input)
            {
                var activity = await _serviceActivityRepository.GetAsync(i.Id);
                ObjectMapper.Map(i, activity);
                await _serviceActivityRepository.UpdateAsync(activity);
            }
        }
        
        public async Task SaveServicePresentationAsync([FromForm] CreateServicePresentationsDto input)
        {
            if (input.Attachments == null || !input.Attachments.Any()) return;
            
            var fileExtensionList = input.Attachments.Select(a => Path.GetExtension(a.FileName)[1..]).ToList();
            foreach (var f in fileExtensionList)
            {
                var isValidExtension = Enum.IsDefined(typeof(AttachmentType), f.ToLower());
                if (!isValidExtension) throw new InvalidOperationException("Invalid File Extension!");
            }

            var userId = AbpSession.GetUserId();
            foreach (var attachment in input.Attachments)
            {
                var document = await _documentsDomainService.CreateAsync(userId, attachment, DocumentType.ServicePresentations);
                await _servicePresentationRepository.InsertAsync(new ServicePresentation
                {
                    ReferenceId = input.ReferenceId,
                    ServiceType = input.ServiceType,
                    DocumentId = document.Id,
                    DisplayOrder = await _servicePresentationRepository.CountAsync(x => x.ReferenceId == input.ReferenceId)
                });
            }
        }

        public async Task<IEnumerable<ServicePresentationDto>> GetAllServicePresentationAsync(Guid referenceId)
        {
            var presentations = await _servicePresentationRepository.GetAll()
                .AsNoTracking()
                .Include(x => x.Document)
                .Where(x => x.ReferenceId == referenceId)
                .Select(x => ObjectMapper.Map<ServicePresentationDto>(x))
                .ToListAsync();
            
            foreach (var presentation in presentations)
                presentation.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(presentation.DocumentId);

            return presentations;
        }
        
        public async Task SaveServiceHandoutAsync([FromForm] CreateServiceHandoutsDto input)
        {
            if (input.Attachments == null || !input.Attachments.Any()) return;
            
            var fileExtensionList = input.Attachments.Select(a => Path.GetExtension(a.FileName)[1..]).ToList();
            foreach (var f in fileExtensionList)
            {
                var isValidExtension = Enum.IsDefined(typeof(AttachmentType), f.ToLower());
                if (!isValidExtension) throw new InvalidOperationException("Invalid File Extension!");
            }

            var userId = AbpSession.GetUserId();
            foreach (var attachment in input.Attachments)
            {
                var document = await _documentsDomainService.CreateAsync(userId, attachment, DocumentType.ServiceHandouts);
                await _serviceHandoutRepository.InsertAsync(new ServiceHandout
                {
                    ReferenceId = input.ReferenceId,
                    ServiceType = input.ServiceType,
                    DocumentId = document.Id,
                    DisplayOrder = await _serviceHandoutRepository.CountAsync(x => x.ReferenceId == input.ReferenceId)
                });
            }
        }

        public async Task<IEnumerable<ServiceHandoutDto>> GetAllServiceHandoutsAsync(Guid referenceId)
        {
            var handouts = await _serviceHandoutRepository.GetAll()
                .AsNoTracking()
                .Include(x => x.Document)
                .Where(x => x.ReferenceId == referenceId)
                .Select(x => ObjectMapper.Map<ServiceHandoutDto>(x))
                .ToListAsync();

            foreach (var handout in handouts)
                handout.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(handout.DocumentId);

            return handouts;
        }

        public async Task<ServiceHandoutDto> GetServiceHandoutAsync(Guid id)
        {
            return await _serviceHandoutRepository.GetAll()
                .AsNoTracking()
                .Include(x => x.Document)
                .Where(x => x.Id == id)
                .Select(x => ObjectMapper.Map<ServiceHandoutDto>(x))
                .SingleOrDefaultAsync();
        }

        private async Task<int> ServiceCreatedCount(long userId, ServicesType type)
        {
            var serviceCreated = type switch
            {
                ServicesType.Event => await _eventsRepository.CountAsync(x => x.CreatorUserId == userId),
                ServicesType.Course => await _coursesRepository.CountAsync(x => x.CreatorUserId == userId),
                ServicesType.Tutorial => await _videosRepository.CountAsync(x => x.CreatorUserId == userId),
                ServicesType.Article => await _articlesRepository.CountAsync(x => x.CreatorUserId == userId),
                ServicesType.Coaching => await _coachingsRepository.CountAsync(x => x.CreatorUserId == userId),
                _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
            };
            return serviceCreated;
        }

        private async Task<decimal> GetServicesReviews(long userId, ServicesType type)
        {
            var reviews = _serviceReviewRepository.GetAll()
                .Where(x => x.ServiceOwnerId == userId)
                .Where(x => x.ServiceType == type);
            
            var sumRatings = (await reviews.SumAsync(x => x.Rating)).ToDecimal();
            var totalReviews = await reviews.CountAsync();
            return totalReviews > 0 ? Math.Round(sumRatings / totalReviews, 1) : 0;
        }
        
        private async Task<List<ServiceReviewDto>> GetServiceReviewDetails(List<ServiceReviewDto> reviews, Guid? notificationId)
        {
            var targetNotification = await _notificationsRepository.GetAll()
                .Include(n => n.Sources)
                .WhereIf(notificationId.HasValue, n => n.Id == notificationId.Value)
                .WhereIf(!notificationId.HasValue, n => false)
                .SingleOrDefaultAsync();

            foreach (var review in reviews)
            {
                review.IsFromNotification = targetNotification != null && targetNotification.Sources.Any(s => s.ReferenceId == review.Id);

                if (review.CreatorUser.ProfilePictureDocumentId.HasValue)
                    review.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(review.CreatorUser.ProfilePictureDocumentId.Value);
            }
            return reviews.OrderByDescending(r => r.IsFromNotification).ThenByDescending(r => r.CreationTime).ToList();
        }
    }
}
