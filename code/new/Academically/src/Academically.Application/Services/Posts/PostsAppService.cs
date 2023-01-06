using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Abp.Timing;
using Academically.Authorization;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Articles;
using Academically.Services.Coachings;
using Academically.Services.Comments.Dto;
using Academically.Services.Courses;
using Academically.Services.Documents;
using Academically.Services.Events;
using Academically.Services.Posts.Dto;
using Academically.Services.Videos;
using Academically.Services.Workshops;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Posts
{
    [AbpAuthorize(PermissionNames.Pages_Posts)]
    public class PostsAppService : AcademicallyAppServiceBase, IPostsAppService
    {
        private readonly IRepository<Post, Guid> _postRepository;
        private readonly IRepository<PostTopic, Guid> _postTopicRepository;
        private readonly IRepository<PostAttachment, Guid> _postAttachmentRepository;
        private readonly IRepository<PostVisibility, Guid> _postVisibilityRepository;
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomyRepository;
        private readonly IRepository<PostNotification, Guid> _postNotificationRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IArticlesAppService _articlesAppService;
        private readonly ICoachingsAppService _coachingsAppService;
        private readonly ICoursesAppService _coursesAppService;
        private readonly IVideosAppService _videosAppService;
        private readonly IEventsAppService _eventsAppService;
        private readonly IWorkshopsAppService _workshopsAppService;
        private readonly IDocumentsAppService _documentsAppService;
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<User, long> _usersRepository;

        public PostsAppService(
            IRepository<Post, Guid> postRepository,
            IRepository<PostTopic, Guid> postTopicRepository,
            IRepository<PostAttachment, Guid> postAttachmentRepository,
            IRepository<PostVisibility, Guid> postVisibilityRepository,
            IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomyRepository,
            IRepository<PostNotification, Guid> postNotificationRepository,
            IDocumentsDomainService documentsDomainService,
            IArticlesAppService articlesAppService,
            ICoachingsAppService coachingsAppService,
            ICoursesAppService coursesAppService,
            IVideosAppService videosAppService,
            IEventsAppService eventsAppService,
            IWorkshopsAppService workshopsAppService,
            IDocumentsAppService documentsAppService,
            IRepository<Comment, Guid> commentsRepository,
            IRepository<User, long> usersRepository)
        {
            _postRepository = postRepository;
            _postTopicRepository = postTopicRepository;
            _postAttachmentRepository = postAttachmentRepository;
            _postVisibilityRepository = postVisibilityRepository;
            _postNotificationRepository = postNotificationRepository;
            _disciplineTaxonomyRepository = disciplineTaxonomyRepository;
            _documentsDomainService = documentsDomainService;
            _articlesAppService = articlesAppService;
            _coachingsAppService = coachingsAppService;
            _coursesAppService = coursesAppService;
            _videosAppService = videosAppService;
            _eventsAppService = eventsAppService;
            _workshopsAppService = workshopsAppService;
            _documentsAppService = documentsAppService;
            _commentsRepository = commentsRepository;
            _usersRepository = usersRepository;
        }

        public async Task<List<PostDto>> GetAllPosts(PostType? type, Guid? parentId)
        {
            var userId = AbpSession.UserId.Value;
            var userHiddenPost = _postVisibilityRepository.GetAll()
                                                          .Where(w => w.IsHidden && w.CreatorUserId == userId)
                                                          .Select(s => s.PostId).ToList();
           var result = await _postRepository.GetAll()
                                  .Include(p => p.CreatorUser)
                                  .Include(e => e.Parent)
                                  .Include(p => p.PostAttachments)
                                    .ThenInclude(a => a.Document)
                                  .Include(p => p.PostTopics)
                                    .ThenInclude(t => t.DisciplineTaxonomy)
                                  .Include(p => p.PostNotification)
                                  .Where(e => !e.IsDeleted)
                                  .WhereIf(type.HasValue, p => p.Type == type)
                                  .WhereIf(parentId.HasValue, p => p.ParentId == parentId)
                                  .WhereIf(!parentId.HasValue, p => p.ParentId == null)
                                  .Where(e => e.IsHidden == false && !userHiddenPost.Contains(e.Id))
                                  .OrderByDescending(p => p.CreationTime)
                                  .Select(p => ObjectMapper.Map<PostDto>(p))
                                  .ToListAsync();
            foreach (var item in result)
            {
                if (item.ServiceId.HasValue)
                {
                    var param = new PagedGetAvailableServicesRequestDto() { Keyword = item.ServiceId.Value.ToString() };
                    item.Service = this.GetAvailableServices(param).Result.Items.FirstOrDefault();
                }

                foreach (var attachment in item.PostAttachments)
                {
                    attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);
                }
            }

            return result;
        }

        [AbpAuthorize(PermissionNames.Pages_Posts_Create)]
        public async Task Create([FromForm] CreatePostDto input)
        {
            var post = ObjectMapper.Map<Post>(input);
            var postId = await _postRepository.InsertAndGetIdAsync(post);

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
                        await _postTopicRepository.InsertAsync(new PostTopic
                        {
                            PostId = postId,
                            DisciplineTaxonomyId = topicId,
                        });
                    }
                }
            }

            if (input.Topics != null && input.Topics.Any())
            {
                foreach (var topicId in input.Topics)
                {
                    await _postTopicRepository.InsertAsync(new PostTopic
                    {
                        PostId = postId,
                        DisciplineTaxonomyId = topicId,
                    });
                }
            }

            if (input.Attachments != null && input.Attachments.Any())
            {
                var fileExtensionList = input.Attachments.Select(a => Path.GetExtension(a.FileName).Substring((1))).ToList();
                foreach (var f in fileExtensionList)
                {
                    var isVailidExtension = Enum.IsDefined(typeof(AttachmentType), f.ToLower());
                    if (!isVailidExtension)
                    {
                        throw new InvalidOperationException("Invalid File Extension!");
                    }
                }

                var userId = AbpSession.UserId.Value;
                foreach (var attachment in input.Attachments)
                {
                    var document = await _documentsDomainService.CreateAsync(userId, attachment, DocumentType.PostAttachment);
                    await _postAttachmentRepository.InsertAsync(new PostAttachment
                    {
                        PostId = postId,
                        DocumentId = document.Id,
                    });
                }
            }
        }

        public async Task<List<PostDto>> GetByUser(long userId, PostType? type)
        {
            var userHiddenPost = _postVisibilityRepository.GetAll()
                                                          .Where(w => w.IsHidden && w.CreatorUserId == userId)
                                                          .Select(s => s.PostId).ToList();
            var result = await _postRepository.GetAll()
                .Include(p => p.CreatorUser)
                .Include(p => p.PostNotification)
                .WhereIf(type.HasValue, p => p.Type == type)
                .Where(p => p.CreatorUserId == userId)
                .Where(e => e.IsHidden == false && !userHiddenPost.Contains(e.Id))
                .OrderByDescending(p => p.CreationTime)
                .Select(p => ObjectMapper.Map<PostDto>(p))
                .ToListAsync();

            foreach (var item in result)
            {
                if (item.ServiceId.HasValue)
                {
                    var param = new PagedGetAvailableServicesRequestDto() { Keyword = item.ServiceId.Value.ToString() };
                    item.Service = this.GetAvailableServices(param).Result.Items.FirstOrDefault();
                }
            }

            return result;
        }

        public async Task<PostDto> GetAsync(Guid id)
        {
            var userId = AbpSession.UserId.Value;
            var userHiddenPost = _postVisibilityRepository.GetAll()
                                                          .Where(w => w.IsHidden && w.CreatorUserId == userId)
                                                          .Select(s => s.PostId).ToList();
            var post = await _postRepository.GetAll()
                        .Include(p => p.CreatorUser)
                        .Include(p => p.Children)
                            .ThenInclude(p => p.CreatorUser)
                        .Include(p => p.PostAttachments)
                            .ThenInclude(a => a.Document)
                        .Include(p => p.PostTopics)
                            .ThenInclude(t => t.DisciplineTaxonomy)
                        .Include(p => p.PostNotification)
                        .Where(e => e.IsHidden == false && !userHiddenPost.Contains(e.Id))
                        .SingleOrDefaultAsync(p => p.Id == id);

            var result = ObjectMapper.Map<PostDto>(post);
            var participants = new List<UserDto>();
            if (post.Children.Any())
            {
                participants.AddRange(post.Children.Select(s => ObjectMapper.Map<UserDto>(s.CreatorUser)));
            }
            var commentsParticipant = _commentsRepository.GetAll()
                    .Where(w => w.ReferenceId == id.ToString())
                    .Include(c => c.CreatorUser)
                    .Select(s => ObjectMapper.Map<UserDto>(s.CreatorUser));

            if (commentsParticipant.Any())
            {
                participants.AddRange(commentsParticipant);
            }
            result.Participants = participants.GroupBy(g => g.Id).ToList().Select(s => s.FirstOrDefault());

            return result;
        }

        public async Task<PostDto> UpdateAsync(UpdatePostDto input)
        {
            var post = await _postRepository.GetAsync(input.Id);
            if (post == null)
                return null;
            if (post.IsDeleted)
            {
                post.DeleterUserId = AbpSession.UserId.Value;
                post.DeletionTime = DateTime.Now;
            }
            else
            {
                post.LastModifierUserId = AbpSession.UserId.Value;
                post.LastModificationTime = DateTime.Now;
            }

            ObjectMapper.Map(input, post);
            post = await _postRepository.UpdateAsync(post);

            return ObjectMapper.Map<PostDto>(post);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _postRepository.DeleteAsync(id);
        }

        public async Task<AvailableServiceDto> GetAvailableService(Guid id)
        {
            var param = new PagedGetAvailableServicesRequestDto() { Keyword = id.ToString() };
            return this.GetAvailableServices(param).Result.Items.FirstOrDefault();
        }

        public async Task<PagedResultDto<AvailableServiceDto>> GetAvailableServices(PagedGetAvailableServicesRequestDto request)
        {
            var articles = await _articlesAppService.GetArticlesByKeyword(request.Keyword);
            var courses = await _coursesAppService.GetCoursesByKeyword(request.Keyword);
            var coaching = await _coachingsAppService.GetCoachingByKeyword(request.Keyword);
            var videos = await _videosAppService.GetVideosByKeyword(request.Keyword);
            var workshops = await _workshopsAppService.GetWorkshopByKeyword(request.Keyword);
            var events = await _eventsAppService.GetEventsByKeyword(request.Keyword);

            var query = articles.Union(courses)
                                .Union(coaching)
                                .Union(videos)
                                .Union(workshops)
                                .Union(events)
                                .AsQueryable();

            if (!request.Sorting.IsNullOrWhiteSpace())
                query = Sort(query, request.Sorting);

            if (request.Take.HasValue)
                query = query.Take(request.Take.Value);

            var totalCount = query.Count();

            query = query.PageBy(request);

            var availableServices = query.Select(x => ObjectMapper.Map<AvailableServiceDto>(x)).ToList();
            foreach (var item in availableServices)
            {
                //ImageDocumentId: thumbnail for courses
                var docId = item.ImageDocumentId.HasValue ? item.ImageDocumentId.Value : item.ThumbnailDocumentId.GetValueOrDefault();
                if (docId != null)
                {
                    try
                    {
                        item.ThumbnailImageUrl = _documentsDomainService.GetFileUrlAsync(docId).Result;
                    }
                    catch (Exception)
                    {
                        item.ThumbnailImageUrl = string.Empty;
                    }
                }
            }
            return new PagedResultDto<AvailableServiceDto>()
            {
                TotalCount = totalCount,
                Items = availableServices
            }; 
        }

        public async Task<CommentDto> CreateCommentAsync(CommentDto input)
        {
            var comment = ObjectMapper.Map<Comment>(input);
            input.CreationTime = Clock.Now;
            input.Id = await _commentsRepository.InsertAndGetIdAsync(comment);
            return input;
        }

        private IQueryable<AvailableServiceDto> Sort(IQueryable<AvailableServiceDto> query, string sorting)
        {
            if (sorting.Contains("recent"))
                query = query.OrderByDescending(x => x.CreationTime);
            //else if (sorting.Contains("popular"))//todo
            //    query = query.OrderByDescending(x => x); 
            else if (sorting.Contains("foryou"))
                query = query.OrderBy(x => x.Name);
            else
                query = query.OrderBy(x => x.Name);
            return query;
        }

        public async Task SetPostVisibility([FromForm] PostVisibilityDto input)
        {
            input.CreatorUserId = AbpSession.UserId.Value;
            var mainPost = _postRepository.FirstOrDefault(f => f.Id == input.PostId);
            if (mainPost != null)
            {
                if (mainPost.CreatorUserId == input.CreatorUserId)
                {
                    mainPost.IsHidden = input.IsHidden;
                    await _postRepository.UpdateAsync(mainPost);
                }
                var userBoardPost = _postVisibilityRepository.FirstOrDefault(f => f.PostId == input.PostId && f.CreatorUserId == input.CreatorUserId);
                if (userBoardPost != null)
                {
                    userBoardPost.IsHidden = input.IsHidden;
                    await _postVisibilityRepository.UpdateAsync(userBoardPost);
                }
                else
                {
                    var newPostVisibility = ObjectMapper.Map<PostVisibility>(input);
                    await _postVisibilityRepository.InsertAsync(newPostVisibility);
                }
            }
        }

        public async Task CreatePostNotification([FromForm] CreatePostNotificationDto input)
        {
            var postNotif = ObjectMapper.Map<PostNotification>(input);
            await _postNotificationRepository.InsertAsync(postNotif);
        }

        public async Task DeletePostNotification(DeletePostNotificationDto input)
        {
            await _postNotificationRepository.DeleteAsync(p => p.PostId == input.PostId && p.CreatorUserId == input.CreatorUserId);
        }
    }
}
