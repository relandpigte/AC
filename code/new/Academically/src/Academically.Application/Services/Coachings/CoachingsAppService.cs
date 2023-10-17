using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Expressions;
using Abp.Linq.Extensions;
using Abp.Timing;
using Abp.UI;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Configuration;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.EntityFrameworkCore.Repositories.Explore;
using Academically.Extensions;
using Academically.Services.Coachings.Dto;
using Academically.Services.Explore.Dto;
using Academically.Services.Posts.Dto;
using Academically.Services.Services.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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
        private readonly IExploreRepository _exploreRepository;

        public CoachingsAppService(
            RoleManager roleManager,
            IRepository<User, long> usersRepository,
            IRepository<CoachingPresenter, Guid> coachingPresentersRepository,
            IRepository<Coaching, Guid> repository,
            IRepository<SavedService, Guid> savedServiceRepository,
            IRepository<ServicePurchase, Guid> servicePurchasesRepository,
            IDocumentsDomainService documentsDomainService,
            IExploreRepository exploreRepository
            ) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _usersRepository = usersRepository;
            _coachingPresentersRepository = coachingPresentersRepository;
            _savedServiceRepository = savedServiceRepository;
            _servicePurchasesRepository = servicePurchasesRepository;
            _documentsDomainService = documentsDomainService;
            _exploreRepository = exploreRepository;
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

                var savedService = await this._savedServiceRepository.FirstOrDefaultAsync(s => s.ReferenceId.ToString() == coaching.Id.ToString());
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
            return await Repository.GetAll().Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                                  .WhereIf(!keyword.IsNullOrWhiteSpace(), x => x.Name.Contains(keyword) || x.Description.Contains(keyword) || x.Price.ToString().Contains(keyword)
                                           || x.Id.ToString().Equals(keyword))
                                  .WhereIf(creatorUserId.HasValue, x => x.CreatorUserId == creatorUserId)
                                  .Include(c => c.CreatorUser)
                                  .AsNoTracking()
                                  .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                                  .ToListAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetCoachingSchedule(long? creatorUserId, ScheduledServiceType? type)
        {
            var purchases = await this._servicePurchasesRepository.GetAll()
                .WhereIf(creatorUserId.HasValue, p => false)
                .WhereIf(!creatorUserId.HasValue, p => p.CreatorUserId == this.AbpSession.UserId)
                .Select(p => p.ReferenceId)
                .ToListAsync();

            return await Repository.GetAll().Where(w => w.ParentId == null && w.Visible.Value && w.Status == CoachingStatus.Published)
                                  .WhereIf(creatorUserId.HasValue, x => x.CreatorUserId == creatorUserId)
                                  .WhereIf(purchases.Count > 0, x => purchases.Contains(x.Id))
                                  .WhereIf(type.HasValue && type == ScheduledServiceType.Upcoming, c => true)
                                  .WhereIf(type.HasValue && type == ScheduledServiceType.Past, c => true)
                                  .WhereIf(type.HasValue && type == ScheduledServiceType.Cancelled, c => true)
                                  .Include(c => c.CreatorUser)
                                  .AsNoTracking()
                                  .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                                  .ToListAsync();
        }
    }
}
