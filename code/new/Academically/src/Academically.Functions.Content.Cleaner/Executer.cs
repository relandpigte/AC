using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Timing;
using Castle.Core.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Reflection.Extensions;
using System.Text;
using System.Globalization;
using Abp.IO.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using Academically.Domain.Entities;
using Academically.Domain.Services.Documents;

namespace Academically.Functions.Content.Cleaner
{
    public class Executer : ITransientDependency
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly IRepository<Post, Guid> _postRepository;
        private readonly IRepository<PostAttachment, Guid> _postAttachmentsRepository;
        private readonly IRepository<Comment, Guid> _commentRepository;
        private readonly IRepository<Reaction, Guid> _reactionRepository;
        private readonly IRepository<Course, Guid> _courseRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Video, Guid> _videoRepository;
        private readonly IRepository<Article, Guid> _articleRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public Executer(
            IConfiguration config,
            ILogger logger,
            IRepository<Post, Guid> postRepository,
            IRepository<PostAttachment, Guid> postAttachmentsRepository,
            IRepository<Comment, Guid> commentRepository,
            IRepository<Reaction, Guid> reactionRepository,
            IRepository<Course, Guid> courseRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Video, Guid> videoRepository,
            IRepository<Article, Guid> articleRepository,
            IRepository<Event, Guid> eventRepository,
            IDocumentsDomainService documentsDomainService
        )
        {
            _config = config;
            _logger = logger;
            _postRepository = postRepository;
            _postAttachmentsRepository = postAttachmentsRepository;
            _commentRepository = commentRepository;
            _reactionRepository = reactionRepository;
            _courseRepository = courseRepository;
            _coachingRepository = coachingRepository;
            _videoRepository = videoRepository;
            _articleRepository = articleRepository;
            _eventRepository = eventRepository;
            _documentsDomainService = documentsDomainService;
        }

        [UnitOfWork(isTransactional: false)]
        public virtual async Task<bool> RunAsync()
        {
            // 30 Days
            await CleanPosts(30);
            await CleanServices(30);

            return true;
        }

        [UnitOfWork]
        private async Task CleanPosts(int days)
        {
            var targetDate = Clock.Now.AddDays(-days);

            this._logger.Info($"[Content.Cleaner] Deleting posts that are soft deleted from {targetDate} and earlier.");

            var candidatePosts = _postRepository.GetAll()
                .Where(v => v.IsDeleted && v.DeletionTime <= targetDate)
                .ToList();
            var idsToDelete = candidatePosts.Select(p => p.Id).ToList();

            this._logger.Info($"[Content.Cleaner] Found {idsToDelete.Count} posts to delete.");

            foreach (var id in idsToDelete)
            {
                // comment attachments
                var commentAttachments = _postAttachmentsRepository.GetAll().Where(a => a.PostId == id).ToList();
                this._logger.Info($"[Content.Cleaner] Found {commentAttachments.Count} comment documents in S3 to delete for post {id}.");
                foreach (var attachment in commentAttachments) await _documentsDomainService.DeleteAsync(attachment.DocumentId);
                await _postAttachmentsRepository.DeleteAsync(a => a.PostId == id);

                // post attachments
                var postAttachments = _postAttachmentsRepository.GetAll().Where(a => a.PostId == id).ToList();
                this._logger.Info($"[Content.Cleaner] Found {postAttachments.Count} documents in S3 to delete for post {id}.");
                foreach (var attachment in postAttachments) await _documentsDomainService.DeleteAsync(attachment.DocumentId);
                await _postAttachmentsRepository.DeleteAsync(a => a.PostId == id);

                // comments
                var comments = _commentRepository.GetAll().Where(c => c.ReferenceId == id.ToString()).ToList();
                this._logger.Info($"[Content.Cleaner] Found {comments.Count} comments to delete for post {id}.");
                await _commentRepository.DeleteAsync(c =>c.ReferenceId == id.ToString());

                // reactions
                var reactions = _reactionRepository.GetAll().Where(r => r.ReferenceId == id.ToString()).ToList();
                this._logger.Info($"[Content.Cleaner] Found {reactions.Count} reactions to delete for post {id}.");
                await _reactionRepository.DeleteAsync(r => r.ReferenceId == id.ToString());

                // post
                await _postRepository.DeleteAsync(id);
            }

            this._logger.Info($"[Content.Cleaner] Deleted {idsToDelete.Count} posts.");
        }
        private async Task CleanServices(int days)
        {
            // await CleanCourses(days);
            // await CleanCoachings(days);
            // await CleanVideos(days);
            // await CleanArticles(days);
            // await CleanEvents(days);
        }

        /*
        private async Task CleanCourses(int days)
        {
            var targetDate = Clock.Now.AddDays(-days);

            this._logger.Info($"[Content.Cleaner] Deleting courses that are soft deleted from {targetDate} and earlier.");

            var candidateServices = _courseRepository.GetAll()
                .Where(s => s.IsDeleted && s.DeletionTime <= targetDate)
                .ToList();
            var idsToDelete = candidateServices.Select(p => p.Id).ToList();

            this._logger.Info($"[Content.Cleaner] Found {idsToDelete.Count} courses to delete.");

            await _courseRepository.DeleteAsync(c => idsToDelete.Contains(c.Id));

            this._logger.Info($"[Content.Cleaner] Deleted {idsToDelete.Count} courses.");
        }
        */
    }
}
