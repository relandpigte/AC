using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Services.Documents;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings.Dto;
using Academically.Services.Comments.Dto;
using Academically.Services.Courses.Dto;
using Academically.Services.Events.Dto;
using Academically.Services.Videos.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Uow;
using Abp.EntityHistory;
using Abp.Events.Bus.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace Academically.Services.Comments
{
    public class CommentsAppService : AcademicallyAppServiceBase, ICommentsAppService
    {
        private readonly IRepository<Comment, Guid> _commentsRepository;
        private readonly IRepository<CommentReaction, Guid> _commentsReactionsRepository;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<Article, Guid> _articlesRepository;
        private readonly IRepository<Course, Guid> _coursesRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Video, Guid> _videoRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly IRepository<EntityChange, long> _entityChangeRepository;

        public CommentsAppService(
            IRepository<Comment, Guid> commentsRepository,
            IRepository<CommentReaction, Guid> commentsReactionsRepository,
            IRepository<User, long> usersRepository,
            IRepository<Article, Guid> articlesRepository,
            IRepository<Course, Guid> coursesRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Video, Guid> videoRepository,
            IRepository<Event, Guid> eventRepository,
            IDocumentsDomainService documentsDomainService,
            IRepository<EntityChange, long> entityChangeRepository)
        {
            _commentsRepository = commentsRepository;
            _commentsReactionsRepository = commentsReactionsRepository;
            _usersRepository = usersRepository;
            _articlesRepository = articlesRepository;
            _coursesRepository = coursesRepository;
            _coachingRepository = coachingRepository;
            _videoRepository = videoRepository;
            _eventRepository = eventRepository;
            _documentsDomainService = documentsDomainService;
            _entityChangeRepository = entityChangeRepository;
        }

        public async Task<IEnumerable<CommentDto>> GetAllAsync(string referenceId)
        {
            var commentsWithReplyCount = await _commentsRepository.GetAll()
                .Where(e => e.ParentId == null && e.ReferenceId == referenceId)
                .Include(e => e.CreatorUser)
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
        
        

        public async Task<PagedResultDto<CommentDto>> GetAllRepliesAsync(PagedCommentResultRequestDto input)
        {
            var query = _commentsRepository.GetAll()
                .Where(e => e.ParentId == input.ParentIdFilter);
            var totalCount = await query.CountAsync();
            var comments = await query.OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Include(e => e.CreatorUser)
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

        public async Task<CommentDto> CreateAsync(CommentDto input)
        {
            var comment = ObjectMapper.Map<Comment>(input);
            input.CreationTime = Clock.Now;
            input.Id = await _commentsRepository.InsertAndGetIdAsync(comment);
            input.CreatorUser = await _usersRepository.GetAllIncluding()
                .Where(e => e.Id == AbpSession.UserId.Value)
                .Include(e => e.ProfilePictureDocument)
                .Select(e => ObjectMapper.Map<UserDto>(e))
                .FirstOrDefaultAsync();
            return input;
        }

        public async Task<CommentReactionDto> CreateReactionAsync(CommentReactionDto input)
        {
            input.CreatorUserId = AbpSession.UserId.Value;
            var reaction = ObjectMapper.Map<CommentReaction>(input);
            input.Id = await _commentsReactionsRepository.InsertAndGetIdAsync(reaction);
            return input;
        }

        public async Task DeleteReactionAsync(Guid id)
        {
            await _commentsReactionsRepository.DeleteAsync(id);
        }

        public async Task DeleteCommentAsync(Guid commentId)
        {
            await _commentsRepository.DeleteAsync(comment => comment.Id == commentId);
            
            var subComments = await _commentsRepository.GetAll()
                .Where(e => e.ParentId == commentId).ToListAsync();

            if (subComments.Count > 0)
            {
                foreach (var sc in subComments)
                {
                    await DeleteCommentAsync(sc.Id);
                }
            }
        }
        
        public async Task<CommentDto> UpdateAsync([FromForm] UpdateCommentDto input)
        {
            var comment = await _commentsRepository.GetAll()
                .Include(e => e.CreatorUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.TaggedUser)
                .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .OrderByDescending(e => e.CreationTime)
                .Where(e => e.Id == input.Id)
                .SingleOrDefaultAsync();
            if (comment == null) return null;

            ObjectMapper.Map(input, comment);
            comment = await _commentsRepository.UpdateAsync(comment);

            return ObjectMapper.Map<CommentDto>(comment);
        }
        
        public async Task<CommentDto> GetAsync(Guid id, bool includeHistory = false)
        {
            var comment = await _commentsRepository.GetAll()
                .Include(e => e.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.TaggedUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.CommentReactions)
                .OrderByDescending(e => e.CreationTime)
                .Where(e => e.Id == id)
                .SingleOrDefaultAsync();
            
            if (comment == null) return null;
            
            var result = ObjectMapper.Map<CommentDto>(comment);
            if (includeHistory) result.CommentEditHistories = await GetCommentEditHistory(comment);

            return result;
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

        private async Task<List<CommentEditHistoryDto>> GetCommentEditHistory(Comment comment)
        {
            var entityChanges = await _entityChangeRepository.GetAll()
                .Include(x => x.PropertyChanges)
                .Where(x => x.EntityTypeFullName == typeof(Comment).FullName && x.EntityId == $"\"{comment.Id}\"" && x.ChangeType == EntityChangeType.Updated)
                .OrderByDescending(x => x.ChangeTime)
                .ToListAsync();
            
            var histories = new List<CommentEditHistoryDto>();
            foreach (var entityChange in entityChanges)
            {
                var history = new CommentEditHistoryDto 
                { 
                    ChangeTime = entityChange.ChangeTime 
                };

                foreach (var propertyChange in entityChange.PropertyChanges)
                {
                    switch (propertyChange.PropertyName)
                    {
                        case nameof(history.Body):
                            history.Body = propertyChange.OriginalValue.Trim('"'); break;
                    }
                }
                histories.Add(history);
            }
            return histories;
        }
    }
}
