using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;
using Academically.Services.Workshops.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Workshops
{
    public class WorkshopsAppService : AsyncCrudAppService<Workshop, WorkshopDto, Guid, PagedWorkshopResultRequestDto, CreateWorkshopDto, UpdateWorkshopDto>, IWorkshopsAppService
    {
        private readonly RoleManager _roleManager;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<WorkshopPresenter, Guid> _workshopPresentersRepository;

        public WorkshopsAppService(
            RoleManager roleManager,
            IRepository<User, long> usersRepository,
            IRepository<WorkshopPresenter, Guid> workshopPresentersRepository,
            IRepository<Workshop, Guid> repository
            ) : base(repository)
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;

            _roleManager = roleManager;
            _usersRepository = usersRepository;
            _workshopPresentersRepository = workshopPresentersRepository;
        }

        protected override IQueryable<Workshop> CreateFilteredQuery(PagedWorkshopResultRequestDto input)
        {
            return base.CreateFilteredQuery(input)
                .WhereIf(input.UserIdFilter.HasValue, e => e.CreatorUserId == input.UserIdFilter.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter.ToLower())
                    || e.Description.ToLower().Contains(input.SearchFilter.ToLower()))
                .WhereIf(input.StatusFilter.HasValue, e => e.Status == input.StatusFilter.Value);
        }

        protected override IQueryable<Workshop> ApplyPaging(IQueryable<Workshop> query, PagedWorkshopResultRequestDto input)
        {
            return base.ApplyPaging(query, input).Include(e => e.ThumbnailDocument);
        }

        protected override Task<Workshop> GetEntityByIdAsync(Guid id)
        {
            return Repository.GetAll()
                .Where(e => e.Id == id)
                .Include(e => e.ThumbnailDocument)
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .FirstOrDefaultAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetAllWorkshop()
        {
            return await Repository.GetAll()
                             .AsNoTracking()
                             .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                             .ToListAsync();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IEnumerable<AvailableServiceDto>> GetWorkshopByKeyword(string keyword)
        {
            return await Repository.GetAll()
                             .WhereIf(!keyword.IsNullOrWhiteSpace(),
                                x => x.Name.Contains(keyword) || x.Description.Contains(keyword) || x.Categories.Contains(keyword))
                             .AsNoTracking()
                             .Select(e => ObjectMapper.Map<AvailableServiceDto>(e))
                             .ToListAsync();
        }

        public async Task UpdateStatusAsync(Guid id, WorkshopStatus status)
        {
            var @event = await Repository.GetAsync(id);
            @event.Status = status;
            await Repository.UpdateAsync(@event);
        }

        public async Task UpdatePresenterTypeAsync(UpdateWorkshopPresenterTypeDto input)
        {
            var workshopPresenter = await _workshopPresentersRepository.GetAsync(input.Id);
            workshopPresenter.Type = input.NewType;
            await _workshopPresentersRepository.UpdateAsync(workshopPresenter);
        }

        public async Task RemovePresenterAsync(Guid workshopPresenterId)
        {
            await _workshopPresentersRepository.DeleteAsync(workshopPresenterId);
        }

        public async Task InvitePresenterAsync(CreateWorkshopPresenterDto input)
        {
            var workshopPresenter = ObjectMapper.Map<WorkshopPresenter>(input);

            var user = await _usersRepository.GetAll()
                .FirstOrDefaultAsync(e => e.EmailAddress.ToLower() == input.Email.ToLower());
            if (user != null)
            {
                workshopPresenter.UserId = user.Id;
            }

            workshopPresenter.Status = WorkshopPresenterStatus.Invited;
            await _workshopPresentersRepository.InsertAsync(workshopPresenter);
        }

        public async Task<PagedResultDto<UserDto>> GetPresentersForInvite(PagedWorkshopPresentersForInviteResultRequestDto input)
        {
            input.SearchFilter = input.SearchFilter?.ToLower();
            var workshopPresenterIds = _workshopPresentersRepository.GetAll()
                .Where(e => e.WorkshopId == input.WorkshopIdFilter)
                .Select(e => e.UserId);
            var tutorRole = await _roleManager.GetRoleByNameAsync(StaticRoleNames.Tenants.Tutor);
            var query = _usersRepository.GetAll()
                .Where(e => e.Id != AbpSession.UserId.Value)
                .WhereIf(!string.IsNullOrWhiteSpace(input.SearchFilter), e => e.Name.ToLower().Contains(input.SearchFilter)
                     || e.Surname.ToLower().Contains(input.SearchFilter))
                .Where(e => e.Roles.Any(r => r.RoleId == tutorRole.Id))
                .Where(e => !workshopPresenterIds.Any(id => id == e.Id));
            var totalCount = await query.CountAsync();
            var presenters = await query.PageBy(input)
                .OrderBy(e => e.Name)
                    .ThenBy(e => e.Surname)
                .Include(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<UserDto>(e))
                .ToListAsync();
            return new PagedResultDto<UserDto>(totalCount, presenters);
        }

        public async Task<IEnumerable<WorkshopPresenterDto>> GetAllPresenters(Guid id)
        {
            return await _workshopPresentersRepository.GetAll()
                .Where(e => e.WorkshopId == id)
                .OrderBy(e => e.User.Name)
                    .ThenBy(e => e.User.Surname)
                .Include(e => e.User)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<WorkshopPresenterDto>(e))
                .ToListAsync();
        }

        public async Task<WorkshopDto> UpdateSettingsAsync(UpdateWorkshopSettingsDto input)
        {
            var @event = await Repository.GetAsync(input.Id);
            ObjectMapper.Map(input, @event);
            await Repository.UpdateAsync(@event);
            return ObjectMapper.Map<WorkshopDto>(@event);
        }
    }
}
