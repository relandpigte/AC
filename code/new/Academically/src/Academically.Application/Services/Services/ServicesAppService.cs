using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Timing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Hubs;
using Academically.Services.Posts;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Academically.Services.StudentCourses;
using Amazon.S3.Model;

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
            IRepository<ServiceBooking, Guid> serviceBooking
            )
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
                .WhereIf(referenceId.HasValue, p => p.ReferenceId == referenceId.Value)
                .WhereIf(userId.HasValue, p => p.CreatorUserId == userId.Value)
                .Select(p => ObjectMapper.Map<ServicePurchaseDto>(p))
                .ToList();
            return purchases;
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
                .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                .FirstOrDefaultAsync();
        }

        public async Task<ServiceBookingDto> CancelBooking(CancelServiceBookingDto input)
        {
            var existing = await _serviceBooking.GetAll()
                .Where(s => s.ReferenceId == input.ReferenceId)
                .Where(s => s.CreatorUserId == this.AbpSession.UserId)
                .SingleOrDefaultAsync();

            if (existing != null)
            {
                existing.CancellationReason = input.CancellationReason;
                existing.CancellationTime = input.CancellationTime;
            }

            return ObjectMapper.Map<ServiceBookingDto>(existing);
        }

        public async Task<IEnumerable<ServiceBookingDto>> GetAllBookings(Guid referenceId, long ownerId)
        {
            return await _serviceBooking.GetAll()
                .Where(x => x.OwnerId == ownerId)
                .Where(x => x.ReferenceId == referenceId)
                .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                .ToListAsync();
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
    }
}
