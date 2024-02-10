using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.Timing;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Extensions;
using Academically.Services.Coachings.Dto;
using Academically.Services.Explore.Dto;
using Academically.Services.Posts.Dto;
using Academically.Services.Services.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace Academically.Services.Coachings
{
    public class CoachingsAppService : AsyncCrudAppService<Coaching, CoachingDto, Guid, PagedCoachingResultRequestDto, CreateCoachingDto, UpdateCoachingDto>, ICoachingsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<CoachingPresenter, Guid> _coachingPresentersRepository;
        private readonly IRepository<SavedService, Guid> _savedServiceRepository;
        private readonly IRepository<ServicePurchase, Guid> _servicePurchasesRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<ServiceBooking, Guid> _serviceBooking;
        private readonly IRepository<ServiceReview, Guid> _serviceReviewRepository;
        private readonly IRepository<ServiceBooking, Guid> _serviceBookingRepository;
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomyRepository;

        public CoachingsAppService(
            RoleManager roleManager,
            IRepository<User, long> usersRepository,
            IRepository<CoachingPresenter, Guid> coachingPresentersRepository,
            IRepository<Coaching, Guid> repository,
            IRepository<SavedService, Guid> savedServiceRepository,
            IRepository<ServicePurchase, Guid> servicePurchasesRepository,
            IDocumentsDomainService documentsDomainService,
            IRepository<ServiceBooking, Guid> serviceBooking,
            IRepository<ServiceReview, Guid> serviceReviewRepository,
            IRepository<ServiceBooking, Guid> serviceBookingRepository, IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomyRepository) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _usersRepository = usersRepository;
            _coachingPresentersRepository = coachingPresentersRepository;
            _savedServiceRepository = savedServiceRepository;
            _servicePurchasesRepository = servicePurchasesRepository;
            _documentsDomainService = documentsDomainService;
            _serviceBooking = serviceBooking;
            _serviceReviewRepository = serviceReviewRepository;
            _serviceBookingRepository = serviceBookingRepository;
            _disciplineTaxonomyRepository = disciplineTaxonomyRepository;
        }

        protected override IQueryable<Coaching> CreateFilteredQuery(PagedCoachingResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StatusFilter.HasValue, e => e.Status == input.StatusFilter.Value);
        }

        protected override IQueryable<Coaching> ApplyPaging(IQueryable<Coaching> query, PagedCoachingResultRequestDto input)
        {
            return base.ApplyPaging(query, input).Include(e => e.ThumbnailDocument);
        }

        protected override Task<Coaching> GetEntityByIdAsync(Guid id)
        {
            return Repository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .FirstOrDefaultAsync();
        }
        
        public override async Task<CoachingDto> GetAsync(EntityDto<Guid> input)
        {
            var result = await Repository.GetAll()
                .Where(e => e.Id == input.Id)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.CoverPhotoDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CoachingTopics)
                    .ThenInclude(c => c.DisciplineTaxonomy)
                .Select(e => ObjectMapper.Map<CoachingDto>(e))
                .FirstOrDefaultAsync();

            result.Purchased = await _servicePurchasesRepository.GetAll()
                .Where(c => c.ReferenceId == result.Id)
                .Select(c => ObjectMapper.Map<UserDto>(c.CreatorUser))
                .ToListAsync();
            
            foreach (var u in result.Purchased)
                if (u.ProfilePictureDocumentId.HasValue)
                    u.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(u.ProfilePictureDocumentId.Value);
            
            if (result.CreatorUser.ProfilePictureDocumentId.HasValue)
                result.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(result.CreatorUser.ProfilePictureDocumentId.Value);
            
            var servicePurchase = await _servicePurchasesRepository
                .FirstOrDefaultAsync(p => p.ReferenceId.ToString() == result.Id.ToString() && p.CreatorUserId == AbpSession.GetUserId());
            result.IsPurchased = servicePurchase != null;
            
            var savedService = await _savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == result.Id.ToString());
            result.IsSaved = savedService != null;
            
            var serviceReview = await _serviceReviewRepository.FirstOrDefaultAsync(r => r.ReferenceId == result.Id && r.CreatorUserId == AbpSession.GetUserId());
            result.HasReviewed = serviceReview != null;

            var latestBooking = await _serviceBooking.GetAll()
                .Where(b => b.ReferenceId == input.Id)
                .Where(b => b.CreatorUserId == this.AbpSession.UserId)
                .OrderByDescending(b => b.CreationTime)
                .FirstOrDefaultAsync();
            result.IsCancelled = latestBooking != null && latestBooking.CancellationTime != null;
            
            return result;
        }

        public async Task UpdateStatusAsync(Guid id, CoachingStatus status)
        {
            var @event = await Repository.GetAsync(id);
            @event.Status = status;
            await Repository.UpdateAsync(@event);
        }

        public async Task UpdatePresenterTypeAsync(UpdateCoachingPresenterTypeDto input)
        {
            var coachingPresenter = await _coachingPresentersRepository.GetAsync(input.Id);
            coachingPresenter.Type = input.NewType;
            await _coachingPresentersRepository.UpdateAsync(coachingPresenter);
        }

        public async Task RemovePresenterAsync(Guid coachingPresenterId)
        {
            await _coachingPresentersRepository.DeleteAsync(coachingPresenterId);
        }

        public async Task InvitePresenterAsync(CreateCoachingPresenterDto input)
        {
            var coachingPresenter = ObjectMapper.Map<CoachingPresenter>(input);

            var user = await _usersRepository.GetAll()
                .FirstOrDefaultAsync(e => e.EmailAddress.ToLower() == input.Email.ToLower());
            if (user != null)
            {
                coachingPresenter.UserId = user.Id;
            }

            coachingPresenter.Status = CoachingPresenterStatus.Invited;
            await _coachingPresentersRepository.InsertAsync(coachingPresenter);
        }

        public async Task<PagedResultDto<UserDto>> GetPresentersForInvite(PagedCoachingPresentersForInviteResultRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var coachingPresenterIds = _coachingPresentersRepository.GetAll()
                .Where(e => e.CoachingId == input.CoachingIdFilter)
                .Select(e => e.UserId);
            var tutorRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Tutor);
            var query = _usersRepository.GetAll()
                .Where(e => e.Id != AbpSession.UserId.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter)
                     || e.Surname.ToLower().Contains(input.SearchFilter))
                .Where(e => e.Roles.Any(r => r.RoleId == tutorRole.Id))
                .Where(e => !coachingPresenterIds.Any(id => id == e.Id));
            var totalCount = await query.CountAsync();
            var presenters = await query.PageBy(input)
                .OrderBy(e => e.Name)
                    .ThenBy(e => e.Surname)
                .Include(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<UserDto>(e))
                .ToListAsync();
            return new PagedResultDto<UserDto>(totalCount, presenters);
        }

        public async Task<IEnumerable<CoachingPresenterDto>> GetAllPresenters(Guid id)
        {
            return await _coachingPresentersRepository.GetAll()
                .Where(e => e.CoachingId == id)
                .OrderBy(e => e.User.Name)
                    .ThenBy(e => e.User.Surname)
                .Include(e => e.User)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<CoachingPresenterDto>(e))
                .ToListAsync();
        }

        public async Task<CoachingDto> UpdateSettingsAsync(UpdateCoachingSettingsDto input)
        {
            var @event = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, @event);
            await Repository.UpdateAsync(@event);
            return ObjectMapper.Map<CoachingDto>(@event);
        }

        public async Task<Dictionary<string, PagedResultDto<CoachingDto>>> GetByTopicAsync(PagedExploreGroupByTopicResultRequestDto input)
        {
            var topics = new List<string>();
            string allTopicsInString;
            IEnumerable<string> distinctTopics = new List<string>();


            if (!string.IsNullOrEmpty(input.Topic))
            {
                distinctTopics = distinctTopics.Append(input.Topic);
            }
            else
            {
                // Get all topics
                topics = await Repository.GetAll()
                    .Where(x => !string.IsNullOrEmpty(x.Categories))
                    .Where(e => e.Visible.Value)
                    .Select(x => x.Categories).ToListAsync();
                allTopicsInString = string.Join(",", topics.ToArray());
                distinctTopics = allTopicsInString.Split(",").OrderBy(x => x).Distinct();
            }

            // Loop on all topics
            var result = new Dictionary<string, PagedResultDto<CoachingDto>>();
            foreach (var topic in distinctTopics)
            {
                var query = Repository.GetAll()
                    .Where(e => e.Visible.Value)
                    .Where(c => c.Categories.Contains(topic));
                var totalCount = await query.CountAsync();
                var coachings = await query
                .PageBy(input)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CoachingDto>(e))
                .ToListAsync();

                foreach (var coaching in coachings)
                {
                    if (coaching.ThumbnailDocumentId.HasValue)
                        coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                    if (coaching.CreatorUser.ProfilePictureDocumentId.HasValue)
                        coaching.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(coaching.CreatorUser.ProfilePictureDocumentId.Value);

                    var savedService = await this._savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == coaching.Id.ToString());
                    coaching.IsSaved = savedService != null;

                    var purchasedService = await this._servicePurchasesRepository.FirstOrDefaultAsync(p => p.ReferenceId.ToString() == coaching.Id.ToString() && p.CreatorUserId == this.AbpSession.UserId);
                    coaching.IsPurchased = purchasedService != null;
                }

                result.Add(topic, new PagedResultDto<CoachingDto>(totalCount, coachings));
            }
              
            return result;
        }

        public async Task<Dictionary<string, PagedResultDto<CoachingDto>>> GetByDatesAsync(PagedExploreGroupByDateResultRequestDto input)
        {
            var query = Repository.GetAll()
                .Where(e => e.Visible.Value && e.Status == CoachingStatus.Published)
                .WhereIf(input.MovingDate.HasValue && input.StartDate.HasValue, v => v.CreationTime < input.MovingDate.Value && v.CreationTime >= input.StartDate.Value) // For next page of latest month
                .WhereIf(input.MovingDate.HasValue && !input.StartDate.HasValue && !input.EndDate.HasValue, v => v.CreationTime < input.MovingDate.Value)
                ;
            var totalCount = await query.CountAsync();
            var coachings = await query
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(e => ObjectMapper.Map<CoachingDto>(e))
                .ToListAsync();

            foreach (var coaching in coachings)
            {
                if (coaching.ThumbnailDocumentId.HasValue)
                    coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                if (coaching.CreatorUser.ProfilePictureDocumentId.HasValue)
                    coaching.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(coaching.CreatorUser.ProfilePictureDocumentId.Value);

                var savedService = await this._savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == coaching.Id.ToString() && s.CreatorUserId == this.AbpSession.UserId);
                coaching.IsSaved = savedService != null;

                var purchasedService = await this._servicePurchasesRepository.FirstOrDefaultAsync(p => p.ReferenceId.ToString() == coaching.Id.ToString() && p.CreatorUserId == this.AbpSession.UserId);
                coaching.IsPurchased = purchasedService != null;
            }

            return coachings.GroupByDateRangePagedExt(input.Grain.Value, input.MaxResultCount);
        }

        public async Task<Dictionary<string, PagedResultDto<CoachingDto>>> GetByPopularityAsync(PagedPopularRequestDto input)
        {
            // Purchase of Coachings is not yet implemented so generate a random popularity list

            var query = Repository.GetAll()
                .Where(e => e.ParentId == null);
            var totalCount = input.MaxResultCount;
            var popularCoachings = await query.Include(e => e.Children)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.CreatorUser)
                .OrderBy(v => Guid.NewGuid())
                .PageBy(input)
                .Select(e => ObjectMapper.Map<CoachingDto>(e))
                .ToListAsync();

            foreach (var popular in popularCoachings)
            {
                if (popular.ThumbnailDocumentId.HasValue)
                    popular.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(popular.ThumbnailDocumentId.Value);
                if (popular.CreatorUser.ProfilePictureDocumentId.HasValue)
                    popular.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(popular.CreatorUser.ProfilePictureDocumentId.Value);

                var savedService = await this._savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == popular.Id.ToString());
                popular.IsSaved = savedService != null;

                var purchasedService = await this._servicePurchasesRepository.FirstOrDefaultAsync(p => p.ReferenceId.ToString() == popular.Id.ToString() && p.CreatorUserId == this.AbpSession.UserId);
                popular.IsPurchased = purchasedService != null;
            }

            return popularCoachings.GroupByPopularityPagedExt(input.MaxResultCount);
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetAllCoaching()
        {
            return await Repository.GetAll().Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                                 .AsNoTracking()
                                 .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                                 .ToListAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetCoachingByKeyword(string keyword, long? creatorUserId)
        {
            return await Repository.GetAll()
                .AsNoTracking()
                .Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                .WhereIf(!keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(keyword) || x.Description.Contains(keyword) || x.Price.ToString().Contains(keyword)
                        || x.Id.ToString().Equals(keyword))
                .WhereIf(creatorUserId.HasValue, x => x.CreatorUserId == creatorUserId)
                .Include(c => c.CreatorUser)
                .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                .ToListAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetCoachingSchedule(long? creatorUserId, ScheduledServiceType? type)
        {
            var now = Clock.Now;
            var bookings = await this._serviceBookingRepository.GetAll()
                .AsNoTracking()
                .WhereIf(creatorUserId.HasValue, b => b.OwnerId == creatorUserId)
                .WhereIf(!creatorUserId.HasValue, b => b.OwnerId == this.AbpSession.UserId)
                .WhereIf(type.HasValue && type == ScheduledServiceType.Upcoming, b => b.CancellationTime == null && b.BookingDateTime >= now)
                .WhereIf(type.HasValue && type == ScheduledServiceType.Past, b => b.CancellationTime == null && b.BookingDateTime < now)
                .WhereIf(type.HasValue && type == ScheduledServiceType.Cancelled, b => b.CancellationTime != null)
                .ToListAsync();

            var bookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var services = await Repository.GetAll()
                .Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                .WhereIf(creatorUserId.HasValue, x => x.CreatorUserId == creatorUserId)
                .WhereIf(!creatorUserId.HasValue, x => x.CreatorUserId == this.AbpSession.UserId)
                .WhereIf(bookings.Count > 0, x => bookingIds.Contains(x.Id))
                .Include(c => c.CreatorUser)
                .AsNoTracking()
                .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                .ToListAsync();

            foreach (var service in services)
            {
                var booking = bookings.Where(b => b.ReferenceId == service.Id).FirstOrDefault();
                if (booking != null)
                {
                    service.EventDateTime = booking.BookingDateTime;
                }
            }

            return services;
        }

        public async Task<IEnumerable<AvailableServiceDto>> GetBookingScheduled(long? ownerId, ScheduledServiceType? type)
        {
            var now = Clock.Now;
            var bookings = await _serviceBookingRepository.GetAll()
                .AsNoTracking()
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .WhereIf(ownerId.HasValue, b => b.OwnerId == ownerId.Value)
                .WhereIf(!ownerId.HasValue, b => b.OwnerId == AbpSession.GetUserId())
                .WhereIf(type is ScheduledServiceType.Upcoming, b => b.CancellationTime == null && b.BookingDateTime >= now)
                .WhereIf(type is ScheduledServiceType.Past, b => b.CancellationTime == null && b.BookingDateTime < now)
                .WhereIf(type is ScheduledServiceType.Cancelled, b => b.CancellationTime != null)
                .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                .ToListAsync();

            var services = new List<AvailableServiceDto>();
            foreach (var booking in bookings)
            {
                if (booking.CreatorUser.ProfilePictureDocumentId.HasValue)
                    booking.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(booking.CreatorUser.ProfilePictureDocumentId.Value);
                
                var service = await Repository.GetAll()
                    .Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                    .WhereIf(ownerId.HasValue, x => x.CreatorUserId == ownerId)
                    .WhereIf(!ownerId.HasValue, x => x.CreatorUserId == AbpSession.GetUserId())
                    .WhereIf(bookings.Count > 0, x => x.Id == booking.ReferenceId)
                    .Include(c => c.CreatorUser)
                        .ThenInclude(u => u.ProfilePictureDocument)
                    .AsNoTracking()
                    .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                    .FirstOrDefaultAsync();

                if (service == null) continue;

                if (service.CreatorUser.ProfilePictureDocumentId.HasValue)
                    service.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(service.CreatorUser.ProfilePictureDocumentId.Value);
                
                service.ServiceBooking = booking;
                service.EventDateTime = booking.BookingDateTime;
                services.Add(service);
            }
            return services.OrderBy(x => x.EventDateTime);
        }

        public async Task<List<CoachingDto>> GetAllPurchasedCoaching(long creatorUserId)
        {
            var purchases = await _servicePurchasesRepository.GetAll()
                .Where(p => p.Type == ServicesType.Coaching)
                .Where(p => p.CreatorUserId == creatorUserId)
                .Select(p => p.ReferenceId)
                .ToListAsync();
            
            var output = await Repository.GetAll()
                .Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                .Where(x => purchases.Contains(x.Id))
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<CoachingDto>(e))
                .ToListAsync();
            
            foreach (var item in output)
            {
                item.Purchased = await _servicePurchasesRepository.GetAll()
                    .Where(c => c.ReferenceId == item.Id)
                    .Select(c => ObjectMapper.Map<UserDto>(c.CreatorUser))
                    .ToListAsync();
                
                foreach (var u in item.Purchased)
                    if (u.ProfilePictureDocumentId.HasValue)
                        u.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(u.ProfilePictureDocumentId.Value);
                
                var serviceReview = await _serviceReviewRepository.FirstOrDefaultAsync(r => r.ReferenceId == item.Id && r.CreatorUserId == AbpSession.GetUserId());
                item.HasReviewed = serviceReview != null;
                
                var savedService = await _savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == item.Id.ToString());
                item.IsSaved = savedService != null;
                
                item.ServiceBooking = await _serviceBookingRepository.GetAll()
                    .Where(x => x.CreatorUserId == AbpSession.GetUserId())
                    .Where(x => x.ReferenceId == item.Id)
                    .OrderByDescending(x => x.BookingDateTime)
                    .Select(x => ObjectMapper.Map<ServiceBookingDto>(x))
                    .FirstOrDefaultAsync();
            }
            return output;
        }

        public async Task<List<CoachingDto>> GetAllSavedCoaching(long creatorUserId)
        {
            var savedIds = await _savedServiceRepository.GetAll().Where(s => s.CreatorUserId == this.AbpSession.UserId).Select(s => s.ReferenceId).ToListAsync();

            var output = await Repository.GetAll()
                .Where(x => savedIds.Contains(x.Id))
                .Include(c => c.CreatorUser)
                .Select(e => ObjectMapper.Map<CoachingDto>(e))
                .ToListAsync();

            foreach (var item in output)
            {
                if (item.ThumbnailDocumentId.HasValue)
                    item.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(item.ThumbnailDocumentId.Value);

                if (item.CreatorUser.ProfilePictureDocumentId.HasValue)
                    item.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(item.CreatorUser.ProfilePictureDocumentId.Value);

                item.Purchased = await _servicePurchasesRepository.GetAll()
                    .Where(c => c.ReferenceId == item.Id)
                    .Select(c => ObjectMapper.Map<UserDto>(c.CreatorUser))
                    .ToListAsync();

                foreach (var u in item.Purchased)
                    if (u.ProfilePictureDocumentId.HasValue)
                        u.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(u.ProfilePictureDocumentId.Value);

                item.IsPurchased = item.Purchased.Any(u => u.Id == this.AbpSession.UserId);

                var serviceReview = await _serviceReviewRepository.FirstOrDefaultAsync(r => r.ReferenceId == item.Id && r.CreatorUserId == AbpSession.GetUserId());
                item.HasReviewed = serviceReview != null;

                item.IsSaved = true;
            }
            return output;
        }

        public override async Task<PagedResultDto<CoachingDto>> GetAllAsync(PagedCoachingResultRequestDto input)
        {
            var output = await base.GetAllAsync(input);
            foreach (var item in output.Items)
            {
                item.Purchased = await _servicePurchasesRepository.GetAll()
                    .Where(c => c.ReferenceId == item.Id)
                    .Select(c => ObjectMapper.Map<UserDto>(c.CreatorUser))
                    .ToListAsync();
                
                foreach (var u in item.Purchased)
                    if (u.ProfilePictureDocumentId.HasValue)
                        u.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(u.ProfilePictureDocumentId.Value);
                
                var serviceReview = await _serviceReviewRepository.FirstOrDefaultAsync(r => r.ReferenceId == item.Id && r.CreatorUserId == AbpSession.GetUserId());
                item.HasReviewed = serviceReview != null;
                
                var savedService = await _savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == item.Id.ToString());
                item.IsSaved = savedService != null;
            }
            return output;
        }

        public async Task<CoachingDto> Duplicate(Guid id)
        {
            var existing = await Repository.GetAll()
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == id);

            existing.Id = Guid.NewGuid();

            var created = await Repository.InsertAsync(existing);
            return ObjectMapper.Map<CoachingDto>(created);
        }
        
        public async Task<CoachingDto> UpdateDetails(UpdateCoachingDto input)
        {
            var coaching = await Repository.GetAll()
                .Include(e => e.CoachingTopics)
                .Where(c => c.Id == input.Id)
                .SingleOrDefaultAsync();
            
            ObjectMapper.Map(input, coaching);
            
            var topicIds = input.Topics?.Count() > 0 ? input.Topics.ToList() : new List<Guid>();
            if (input.NewTopics != null && input.NewTopics.Any())
            {
                var otherTopicParent = await _disciplineTaxonomyRepository.FirstOrDefaultAsync(x => x.Name == "Other Topics");
                if (otherTopicParent != null)
                {
                    foreach (var newTopic in input.NewTopics)
                    {
                        var topicId = await _disciplineTaxonomyRepository.InsertAndGetIdAsync(new DisciplineTaxonomy
                        {
                            ParentId = otherTopicParent.Id,
                            Name = newTopic
                        });

                        topicIds.Add(topicId);
                    }
                }
            }

            // clear all course's topics so we can add the ones that are retained/selected from the frontend side
            coaching.CoachingTopics.Clear();
            foreach (var topicId in topicIds)
            {
                coaching.CoachingTopics.Add(new CoachingTopic
                {
                    CoachingId = coaching.Id,
                    DisciplineTaxonomyId = topicId,
                    CreationTime = DateTime.Now,
                    CreatorUserId = AbpSession.GetUserId()
                });
            }
            
            await Repository.UpdateAsync(coaching);
            return ObjectMapper.Map<CoachingDto>(coaching);
        }
    }
}
