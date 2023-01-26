using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Notifications;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Notifications;
using Academically.Services.UserTopics.Dto;
using Academically.Services.UserTopics.Notifications;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserTopics
{
    [AbpAuthorize(PermissionNames.Pages_Community_UserTopics)]
    public class UserTopicsAppService : AcademicallyAppServiceBase, IUserTopicsAppService
    {
        private readonly IRepository<UserTopic, Guid> _userTopicRepository;
        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;
        private readonly INotificationPublisher _notificationPublisher;

        public UserTopicsAppService(IRepository<UserTopic, Guid> userTopicRepository,
            INotificationSubscriptionManager notificationSubscriptionManager,
            INotificationPublisher notificationPublisher)
        {
            _userTopicRepository = userTopicRepository;
            _notificationSubscriptionManager = notificationSubscriptionManager;
            _notificationPublisher = notificationPublisher;
        }

        public async Task<IEnumerable<UserTopicDto>> GetAll(GetAllUserTopicResultRequestDto request)
        {
            var query = _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Include(x => x.DisciplineTaxonomy.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.DisciplineTaxonomy.Name.ToLower().Contains(request.Keyword.ToLower()))
                .Where(x => x.UserId == request.UserId)
                .Where(x => x.Type == request.Type);

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            return await query.Select(x => ObjectMapper.Map<UserTopicDto>(x)).ToListAsync();
        }

        public async Task<PagedResultDto<UserTopicDto>> GetAllPaged(PagedUserTopicResultRequestDto request)
        {
            var query = _userTopicRepository.GetAll()
                .Include(x => x.DisciplineTaxonomy)
                .Include(x => x.DisciplineTaxonomy.UserTopics)
                .WhereIf(!request.Keyword.IsNullOrWhiteSpace(), x => x.DisciplineTaxonomy.Name.ToLower().Contains(request.Keyword.ToLower()))
                .Where(x => x.UserId == request.UserId)
                .Where(x => x.Type == request.Type);

            var totalCount = await query.CountAsync();

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            query = query.PageBy(request);

            var userTopics = await query.Select(e => ObjectMapper.Map<UserTopicDto>(e))
                .ToListAsync();

            return new PagedResultDto<UserTopicDto>()
            {
                TotalCount = totalCount,
                Items = userTopics
            };
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Create)]
        public async Task Create(CreateUserTopicDto input)
        {
            var userTopic = ObjectMapper.Map<UserTopic>(input);
            await _userTopicRepository.InsertAsync(userTopic);

            await CurrentUnitOfWork.SaveChangesAsync();

            await PublishUserTopicNotification(userTopic.Id, NotificationNames.Notifications_UserTopic_Created);
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Delete)]
        public async Task Delete(Guid id)
        {
            await _userTopicRepository.DeleteAsync(id);

            await PublishUserTopicNotification(id, NotificationNames.Notifications_UserTopic_Deleted);
        }

        [AbpAuthorize(PermissionNames.Pages_Community_UserTopics_Delete)]
        public async Task DeleteByTopicId(Guid id)
        {
            await _userTopicRepository.DeleteAsync(t => t.DisciplineTaxonomyId == id);

            await PublishUserTopicNotification(id, NotificationNames.Notifications_UserTopic_Deleted);
        }

        private IQueryable<UserTopic> Sort(IQueryable<UserTopic> query, string sorting)
        {
            if (sorting.Contains("recent"))
                query = query.OrderByDescending(x => x.CreationTime);
            else if (sorting.Contains("popular"))
                query = query.OrderByDescending(x => x.DisciplineTaxonomy.UserTopics.Count());
            else if (sorting.Contains("foryou"))
                query = query.OrderBy(x => x.DisciplineTaxonomy.Name);
            else
                query = query.OrderBy(x => x.DisciplineTaxonomy.Name);
            return query;
        }

        #region Pub/Sub Notifications

        public async Task SubscribeUserTopicChanges()
        {
            await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value), NotificationNames.Notifications_UserTopic_Created);
            await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value), NotificationNames.Notifications_UserTopic_Updated);
            await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value), NotificationNames.Notifications_UserTopic_Deleted);
        }

        public async Task UnsubscribeUserTopicChanges()
        {
            await _notificationSubscriptionManager.UnsubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value), NotificationNames.Notifications_UserTopic_Created);
            await _notificationSubscriptionManager.UnsubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value), NotificationNames.Notifications_UserTopic_Updated);
            await _notificationSubscriptionManager.UnsubscribeAsync(new UserIdentifier(AbpSession.TenantId, AbpSession.UserId.Value), NotificationNames.Notifications_UserTopic_Deleted);
        }

        private async Task PublishUserTopicNotification(Guid userTopicId, string notificatioName)
        {
            var notificationData = new UserTopicNotificationData();
            notificationData["UserTopicId"] = userTopicId;
            await _notificationPublisher.PublishAsync(
                notificatioName,
                notificationData
            );
        }

        #endregion
    }
}
