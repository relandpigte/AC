using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Conversations.Dto;
using Academically.Services.Documents.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Conversations
{
    [AbpAuthorize(PermissionNames.Pages_Conversations)]
    public class ConversationsAppService : AcademicallyAppServiceBase, IConversationsAppService
    {
        private readonly IRepository<ConversationGroup, Guid> _conversationGroupsRepository;
        private readonly IRepository<Conversation, Guid> _conversationsRepository;
        private readonly IRepository<Project, Guid> _projectsRepository;
        private readonly IRepository<ProjectOffer, Guid> _projectOffersRepository;
        private readonly IRepository<UserCalendarEvent, Guid> _userCalendarEventsRepository;
        private readonly IRepository<ConversationDocument, Guid> _conversationDocumentsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public ConversationsAppService(
            IRepository<ConversationGroup, Guid> conversationGroupsRepository,
            IRepository<Conversation, Guid> conversationsRepository,
            IRepository<Project, Guid> projectsRepository,
            IRepository<ProjectOffer, Guid> projectOffersRepository,
            IRepository<UserCalendarEvent, Guid> userCalendarEventsRepository,
            IRepository<ConversationDocument, Guid> conversationDocumentsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _conversationGroupsRepository = conversationGroupsRepository;
            _conversationsRepository = conversationsRepository;
            _projectsRepository = projectsRepository;
            _projectOffersRepository = projectOffersRepository;
            _userCalendarEventsRepository = userCalendarEventsRepository;
            _conversationDocumentsRepository = conversationDocumentsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<IEnumerable<ConversationDto>> GetAll(Guid projectId)
        {
            var conversations = await _conversationGroupsRepository.GetAll()
                .Where(e => e.ProjectId == projectId)
                .Include(e => e.Conversations)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Conversations)
                    .ThenInclude(e => e.ConversationDocuments)
                        .ThenInclude(e => e.Document)
                .SelectMany(e => e.Conversations)
                .OrderBy(e => e.CreationTime)
                .Select(e => ObjectMapper.Map<ConversationDto>(e))
                .ToListAsync();
            return conversations;
        }

        public async Task<IEnumerable<ConversationGroupDto>> GetGroups(Guid? projectId)
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            var userRoles = await UserManager.GetRolesAsync(user);
            var isTutor = userRoles.Any(e => e == StaticRoleNames.Tenants.Tutor);
            IQueryable<Guid> projectIds;
            if (isTutor)
            {
                projectIds = _projectOffersRepository.GetAll()
                    .WhereIf(projectId.HasValue, e => e.ProjectId == projectId)
                    .Where(e => e.CreatorUserId == user.Id && !e.Project.IsDeleted)
                    .Select(e => e.ProjectId)
                    .Distinct();
            }
            else
            {
                projectIds = _projectsRepository.GetAll()
                    .WhereIf(projectId.HasValue, e => e.Id == projectId)
                    .Where(e => e.CreatorUserId == user.Id)
                    .Select(e => e.Id);
            }

            var conversationGroups = await _conversationGroupsRepository.GetAll()
                .Where(e => projectIds.Any(id => id == e.ProjectId))
                .OrderByDescending(e => e.LastConversationCreationTime)
                .Distinct()
                .Include(e => e.Project)
                    .ThenInclude(e => e.CreatorUser)
                        .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Project)
                    .ThenInclude(e => e.Offers)
                        .ThenInclude(e => e.CreatorUser)
                            .ThenInclude(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<ConversationGroupDto>(e))
                .ToListAsync();

            foreach (var conversationGroup in conversationGroups)
            {
                conversationGroup.UnseenCount = await _conversationsRepository.GetAll()
                    .Where(e => e.ConversationGroupId == conversationGroup.Id)
                    .CountAsync(e => !e.IsSeen);
            }

            return conversationGroups;
        }

        public async Task<IEnumerable<ConversationDocumentDto>> UploadDocuments([FromForm] UploadConversationDocumentsDto input)
        {
            var documents = new List<ConversationDocumentDto>();
            if (input.Documents != null && input.Documents.Any())
            {
                var conversation = await _conversationsRepository.GetAsync(input.ConversationId);
                foreach (var attachment in input.Documents)
                {
                    var document = await _documentsDomainService.CreateAsync(conversation.CreatorUserId.Value, attachment, DocumentType.Conversation);
                    await _conversationDocumentsRepository.InsertAsync(new ConversationDocument()
                    {
                        ConversationId = conversation.Id,
                        DocumentId = document.Id,
                    });
                    documents.Add(new ConversationDocumentDto()
                    {
                        ConversationId = conversation.Id,
                        DocumentId = document.Id,
                        Conversation = ObjectMapper.Map<ConversationDto>(conversation),
                        Document = ObjectMapper.Map<DocumentDto>(document),
                    });
                }
            }
            return documents;
        }
    }
}
