using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Services
{
    public class ServicesAppService : AcademicallyAppServiceBase, IServicesAppService
    {
        private readonly IRepository<Service, Guid> _servicesRepository;
        private readonly IRepository<ServiceMapping, Guid> _serviceMappingsRepository;
        private readonly IRepository<Service2, Guid> _service2sRepository;
        private readonly IRepository<ServiceOffer, Guid> _serviceOffersRepository;

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
            IRepository<ServiceOffer, Guid> serviceOffersRepository
            )
        {
            _servicesRepository = servicesRepository;
            _serviceMappingsRepository = serviceMappingsRepository;
            _service2sRepository = service2sRepository;
            _serviceOffersRepository = serviceOffersRepository;
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
                    return ObjectMapper.Map<ServiceOfferDto>(existing);
                }
            }
            var newOffer = ObjectMapper.Map<ServiceOffer>(input);
            var created = await this._serviceOffersRepository.InsertAsync(newOffer);
            return ObjectMapper.Map<ServiceOfferDto>(created);
        }

        public async Task<IEnumerable<ServiceOfferDto>> GetServiceOffers(Guid referenceId)
        {
            return await this._serviceOffersRepository.GetAll()
                .Where(o => o.ReferenceId == referenceId)
                .Select(o => ObjectMapper.Map<ServiceOfferDto>(o))
                .ToListAsync();
        }

        public async Task<ServiceOfferDto> GetServiceOffer(Guid Id)
        {
            return await this._serviceOffersRepository.GetAll()
                .Where(o => o.Id == Id)
                .Select(o => ObjectMapper.Map<ServiceOfferDto>(o))
                .FirstOrDefaultAsync();
        }
    }
}
