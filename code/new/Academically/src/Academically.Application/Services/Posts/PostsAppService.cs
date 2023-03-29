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
using Academically.Hubs;
using Academically.Services.Articles;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings;
using Academically.Services.Coachings.Dto;
using Academically.Services.Comments.Dto;
using Academically.Services.Courses;
using Academically.Services.Courses.Dto;
using Academically.Services.Documents;
using Academically.Services.Events;
using Academically.Services.Events.Dto;
using Academically.Services.Posts.Dto;
using Academically.Services.Videos;
using Academically.Services.Videos.Dto;
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
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Video, Guid> _videoRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IArticlesAppService _articlesAppService;
        private readonly ICoachingsAppService _coachingsAppService;
        private readonly ICoursesAppService _coursesAppService;
        private readonly IVideosAppService _videosAppService;
        private readonly IEventsAppService _eventsAppService;

        public PostsAppService(
            IRepository<Post, Guid> postRepository,
            IRepository<PostTopic, Guid> postTopicRepository,
            IRepository<PostAttachment, Guid> postAttachmentRepository,
            IRepository<PostVisibility, Guid> postVisibilityRepository,
            IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomyRepository,
            IRepository<PostNotification, Guid> postNotificationRepository,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Course, Guid> coursesRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Video, Guid> videoRepository,
            IRepository<Event, Guid> eventRepository,
            IDocumentsDomainService documentsDomainService,
            IArticlesAppService articlesAppService,
            ICoachingsAppService coachingsAppService,
            ICoursesAppService coursesAppService,
            IVideosAppService videosAppService,
            IEventsAppService eventsAppService,
            IRepository<Comment, Guid> commentsRepository)
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
            _commentsRepository = commentsRepository;
            _articlesRepository = articlesRepository;
            _coursesRepository = coursesRepository;
            _coachingRepository = coachingRepository;
            _videoRepository = videoRepository;
            _eventRepository = eventRepository;
        }

        public async Task<List<PostDto>> GetAllPosts(PostType? type, Guid? parentId)
        {
            var userId = AbpSession.UserId.Value;
            var userHiddenPost = _postVisibilityRepository.GetAll()
                                                          .Where(w => w.IsHidden && w.CreatorUserId == userId)
                                                          .Select(s => s.PostId).ToList();
           var result = await _postRepository.GetAll()
                                  .Include(p => p.CreatorUser)
                                  .Include(p => p.Children)
                                  .Include(e => e.Parent)
                                  .Include(p => p.PostAttachments)
                                    .ThenInclude(a => a.Document)
                                  .Include(p => p.PostTopics)
                                    .ThenInclude(t => t.DisciplineTaxonomy)
                                  .Include(p => p.CreatorUser)
                                    .ThenInclude(u => u.ProfilePictureDocument)
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
                if (item.SharedId.HasValue)
                    await FillInShared(item);

                foreach (var attachment in item.PostAttachments)
                    attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);
                
                item.CommentsCount = await this.GetCommentsCountAsync(item.Id.ToString());
            }

            return result;
        }

        public async Task<PagedResultDto<PostDto>> GetAllPostsPaged(PagedGetAllPostsDto request)
        {
            var userId = AbpSession.UserId.Value;
            var userHiddenPost = _postVisibilityRepository.GetAll()
                                                          .Where(w => w.IsHidden && w.CreatorUserId == userId)
                                                          .Select(s => s.PostId).ToList();
            var query = _postRepository.GetAll()
                                   .Include(p => p.CreatorUser)
                                   .Include(p => p.Children)
                                   .Include(e => e.Parent)
                                   .Include(p => p.PostAttachments)
                                     .ThenInclude(a => a.Document)
                                   .Include(p => p.PostTopics)
                                     .ThenInclude(t => t.DisciplineTaxonomy)
                                   .Include(p => p.CreatorUser)
                                     .ThenInclude(u => u.ProfilePictureDocument)
                                   .Include(p => p.PostNotification)
                                   .Where(e => !e.IsDeleted)
                                   .WhereIf(request.Type.HasValue, p => p.Type == request.Type)
                                   .WhereIf(request.ParentId.HasValue, p => p.ParentId == request.ParentId)
                                   .WhereIf(!request.ParentId.HasValue, p => p.ParentId == null)
                                   .WhereIf(request.CreationTime.HasValue, p => p.CreationTime < request.CreationTime)
                                   .Where(e => e.IsHidden == false && !userHiddenPost.Contains(e.Id))
                                   .OrderByDescending(p => p.CreationTime);
            var totalCount = await query.CountAsync();
            var result = await query.PageBy(request)
                                   .Select(p => ObjectMapper.Map<PostDto>(p))
                                   .ToListAsync();
            foreach (var item in result)
            {
                if (item.SharedId.HasValue)
                    await FillInShared(item);

                foreach (var attachment in item.PostAttachments)
                    attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);

                item.CommentsCount = await this.GetCommentsCountAsync(item.Id.ToString());
            }

            return new PagedResultDto<PostDto>(totalCount, result);
        }

        [AbpAuthorize(PermissionNames.Pages_Posts_Create)]
        public async Task Create([FromForm] CreatePostDto input)
        {
            if(input.Type == PostType.Shared && !input.SharedId.HasValue)
                throw new InvalidOperationException("Post with shared type has no specified post or service.");
            
            if (input.SharedId.HasValue && 
                input.SharedType == SharedType.Service &&
                !input.SharedServiceType.HasValue)
            {
                throw new InvalidOperationException("Service type is required for sharing a service in a post.");
            }

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

            await CurrentUnitOfWork.SaveChangesAsync();
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
                if (item.SharedId.HasValue)
                    await FillInShared(item);

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
                            .ThenInclude(u => u.ProfilePictureDocument)
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

            foreach (var attachment in result.PostAttachments)
            {
                attachment.DocumentUrl = await _documentsDomainService.GetFileUrlAsync(attachment.DocumentId);
            }

            var participants = new List<UserDto>();
            if (post.Children.Any())
            {
                participants.AddRange(post.Children.Select(s => ObjectMapper.Map<UserDto>(s.CreatorUser)));
            }
            var commentsParticipant = _commentsRepository.GetAll()
                    .Where(w => w.ReferenceId == id.ToString())
                    .Include(c => c.CreatorUser)
                    .Include(c => c.TaggedUser)
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

            await _postTopicRepository.DeleteAsync(t => t.PostId == post.Id);
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
                            PostId = post.Id,
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
                        PostId = post.Id,
                        DisciplineTaxonomyId = topicId,
                    });
                }
            }

            var postDto = ObjectMapper.Map<PostDto>(post);
            return postDto;
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
            var currentUser = await GetCurrentUserAsync();
            var articles = await _articlesAppService.GetArticlesByKeyword(request.Keyword, currentUser.Id);
            var courses = await _coursesAppService.GetCoursesByKeyword(request.Keyword, currentUser.Id);
            var coaching = await _coachingsAppService.GetCoachingByKeyword(request.Keyword, currentUser.Id);
            var videos = await _videosAppService.GetVideosByKeyword(request.Keyword, currentUser.Id);
            var events = await _eventsAppService.GetEventsByKeyword(request.Keyword, currentUser.Id);

            var query = articles.Union(courses)
                                .Union(coaching)
                                .Union(videos)
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

                if (item.CreatorUser.ProfilePictureDocumentId.HasValue)
                    item.CreatorUser.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(item.CreatorUser.ProfilePictureDocumentId.Value);
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
            var createdId = await _commentsRepository.InsertAndGetIdAsync(comment);
            await this.CurrentUnitOfWork.SaveChangesAsync();
            var created = await _commentsRepository.GetAll()
                .Include(e => e.CreatorUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.TaggedUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .OrderByDescending(e => e.CreationTime)
                .Where(e => e.Id == createdId)
                .SingleOrDefaultAsync();
            return ObjectMapper.Map<CommentDto>(created);
        }

        public async Task<PagedResultDto<CommentDto>> GetAllCommentsPagedAsync(PagedCommentResultRequestDto input)
        {
            var query = _commentsRepository.GetAll()
                .WhereIf(!input.ReferenceIdFilter.IsNullOrEmpty(), e => e.ReferenceId == input.ReferenceIdFilter)
                .WhereIf(!input.ParentIdFilter.HasValue, e => e.ParentId == null)
                .WhereIf(input.ParentIdFilter.HasValue, e => e.ParentId == input.ParentIdFilter)
                .Include(e => e.Children)
                .Include(e => e.CreatorUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.TaggedUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .OrderByDescending(e => e.CreationTime);

            var totalCount = await query.CountAsync();
            var items = await query
                .PageBy(input)
                .Select(e => new
                {
                    Comment = e,
                    ChildCount = e.Children.Count()
                })
                .ToListAsync();


            var comments = new List<CommentDto>();
            foreach (var commentWithChild in items)
            {
                var comment = ObjectMapper.Map<CommentDto>(commentWithChild.Comment);
                await FillInService(comment);
                comment.ReplyCount = commentWithChild.ChildCount;
                comments.Add(comment);
            }

            return new PagedResultDto<CommentDto>(totalCount, comments);
        }

        public async Task<IEnumerable<CommentDto>> GetAllCommentAsync(string referenceId)
        {
            var commentsWithReplyCount = await _commentsRepository.GetAll()
                .Where(e => e.ParentId == null && e.ReferenceId == referenceId)
                .Include(e => e.CreatorUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.TaggedUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .OrderByDescending(e => e.CreationTime)
                .Select(e => new
                {
                    Comment = e,
                    ChildCount = e.Children.Count(),
                })
                .ToListAsync();

            var list = new List<CommentDto>();
            foreach (var commentWithChild in commentsWithReplyCount)
            {
                var comment = ObjectMapper.Map<CommentDto>(commentWithChild.Comment);
                await FillInService(comment);
                comment.ReplyCount = commentWithChild.ChildCount;
                list.Add(comment);
            }
            return list;
        }

        public async Task<PagedResultDto<CommentDto>> GetAllCommentRepliesAsync(PagedCommentResultRequestDto input)
        {
            var query = _commentsRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter);
            var totalCount = await query.CountAsync();
            var comments = await query.OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.CreatorUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.TaggedUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .Select(e => ObjectMapper.Map<CommentDto>(e))
                .ToListAsync();

            foreach (var comment in comments)
            {
                await FillInService(comment);
            }

            return new PagedResultDto<CommentDto>(totalCount, comments);
        }

        public async Task<int> GetCommentsCountAsync(string referenceId)
        {
            return await _commentsRepository.GetAll().Where(e => e.ReferenceId == referenceId).CountAsync();
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

        private async Task FillInService(CommentDto comment)
        {
            if (comment == null || !comment.ServiceId.HasValue)
                return;

            switch (comment.ServiceType)
            {
                case Domain.Enums.ServicesType.Event:
                case Domain.Enums.ServicesType.Workshop:
                    var event_ = await _eventRepository.GetAsync(comment.ServiceId.Value);
                    comment.Event = ObjectMapper.Map<EventDto>(event_);
                    if (comment.Event.ThumbnailDocumentId.HasValue)
                        comment.Event.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(comment.Event.ThumbnailDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Course:
                    var course = await _coursesRepository.GetAsync(comment.ServiceId.Value);
                    comment.Course = ObjectMapper.Map<CourseDto>(course);
                    if (comment.Course.ImageDocumentId.HasValue)
                        comment.Course.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Tutorial:
                    var video = await _videoRepository.GetAsync(comment.ServiceId.Value);
                    comment.Video = ObjectMapper.Map<VideoDto>(video);
                    if (comment.Video.ThumbnailDocumentId.HasValue)
                        comment.Video.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(comment.Video.ThumbnailDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Article:
                    var article = await _articlesRepository.GetAsync(comment.ServiceId.Value);
                    comment.Article = ObjectMapper.Map<ArticleDto>(article);
                    if (comment.Article.ThumbnailDocumentId.HasValue)
                        comment.Article.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(comment.Article.ThumbnailDocumentId.Value);
                    break;
                case Domain.Enums.ServicesType.Coaching:
                    var coaching = await _coachingRepository.GetAsync(comment.ServiceId.Value);
                    comment.Coaching = ObjectMapper.Map<CoachingDto>(coaching);
                    if (comment.Coaching.ThumbnailDocumentId.HasValue)
                        comment.Coaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                    break;
                default:
                    break;
            }
        }

        private async Task FillInShared(PostDto post)
        {
            if (!post.SharedId.HasValue)
                return;

            if(post.SharedType == SharedType.Post)
            {
                post.SharedPost = await GetAsync(post.SharedId.Value);
            }
            else
            {
                switch (post.SharedServiceType)
                {
                    case ServicesType.Event:
                    case ServicesType.Workshop:
                        var event_ = await _eventRepository.GetAsync(post.SharedId.Value);
                        post.SharedServiceEvent = ObjectMapper.Map<EventDto>(event_);
                        if (post.SharedServiceEvent.ThumbnailDocumentId.HasValue)
                            post.SharedServiceEvent.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(post.SharedServiceEvent.ThumbnailDocumentId.Value);
                        break;
                    case ServicesType.Course:
                        var course = await _coursesRepository.GetAsync(post.SharedId.Value);
                        post.SharedServiceCourse = ObjectMapper.Map<CourseDto>(course);
                        if (post.SharedServiceCourse.ImageDocumentId.HasValue)
                            post.SharedServiceCourse.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(course.ImageDocumentId.Value);
                        break;
                    case ServicesType.Tutorial:
                        var video = await _videoRepository.GetAsync(post.SharedId.Value);
                        post.SharedServiceVideo = ObjectMapper.Map<VideoDto>(video);
                        if (post.SharedServiceVideo.ThumbnailDocumentId.HasValue)
                            post.SharedServiceVideo.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(post.SharedServiceVideo.ThumbnailDocumentId.Value);
                        break;
                    case ServicesType.Article:
                        var article = await _articlesRepository.GetAsync(post.SharedId.Value);
                        post.SharedServiceArticle = ObjectMapper.Map<ArticleDto>(article);
                        if (post.SharedServiceArticle.ThumbnailDocumentId.HasValue)
                            post.SharedServiceArticle.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(post.SharedServiceArticle.ThumbnailDocumentId.Value);
                        break;
                    case ServicesType.Coaching:
                        var coaching = await _coachingRepository.GetAsync(post.SharedId.Value);
                        post.SharedServiceCoaching = ObjectMapper.Map<CoachingDto>(coaching);
                        if (post.SharedServiceCoaching.ThumbnailDocumentId.HasValue)
                            post.SharedServiceCoaching.ThumbnailImageUrl = await _documentsDomainService.GetFileUrlAsync(coaching.ThumbnailDocumentId.Value);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
