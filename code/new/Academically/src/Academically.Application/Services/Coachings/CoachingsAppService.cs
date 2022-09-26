using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Configuration;
using Abp.Domain.Repositories;
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
using Academically.Extensions;
using Academically.Services.Coachings.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Academically.Services.Coachings
{
    public class CoachingsAppService : AsyncCrudAppService<Coaching, CoachingDto, Guid, PagedCoachingResultRequestDto, CreateCoachingDto, UpdateCoachingDto>, ICoachingsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<CoachingPresenter, Guid> _coachingPresentersRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public CoachingsAppService(
            RoleManager roleManager,
            IRepository<User, long> usersRepository,
            IRepository<CoachingPresenter, Guid> coachingPresentersRepository,
            IRepository<Coaching, Guid> repository,
            IDocumentsDomainService documentsDomainService
            ) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _usersRepository = usersRepository;
            _coachingPresentersRepository = coachingPresentersRepository;
            _documentsDomainService = documentsDomainService;
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

        public async Task<Dictionary<string, List<CoachingDto>>> GetByTopicAsync()
        {
            var coachings = await Repository.GetAll()
                .Include(x => x.ThumbnailDocument)
                .Include(x => x.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(x => ObjectMapper.Map<CoachingDto>(x))
                .ToListAsync();

            foreach (var coaching in coachings)
            {
                if (coaching.ThumbnailDocumentId.HasValue)
                    coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                if (coaching.CreatorUser.ProfilePictureDocumentId.HasValue)
                    coaching.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(coaching.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return coachings.GroupByTopicExt();
        }

        public async Task<Dictionary<string, List<CoachingDto>>> GetByDatesAsync(DateGrains grain, int itemsPerGroup = 6)
        {
            var coachings = await Repository.GetAll()
                .Include(x => x.ThumbnailDocument)
                .Include(x => x.CreatorUser)
                .OrderByDescending(v => v.CreationTime)
                .Select(x => ObjectMapper.Map<CoachingDto>(x))
                .ToListAsync();

            foreach (var coaching in coachings)
            {
                if (coaching.ThumbnailDocumentId.HasValue)
                    coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                if (coaching.CreatorUser.ProfilePictureDocumentId.HasValue)
                    coaching.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(coaching.CreatorUser.ProfilePictureDocumentId.Value);
            }

            return coachings.GroupByDateRangeExt(grain, itemsPerGroup);
        }
    }
}
