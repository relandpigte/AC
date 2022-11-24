using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.Posts.Dto;
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
        private readonly IRepository<DisciplineTaxonomy, Guid> _disciplineTaxonomyRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public PostsAppService(
            IRepository<Post, Guid> postRepository,
            IRepository<PostTopic, Guid> postTopicRepository,
            IRepository<PostAttachment, Guid> postAttachmentRepository,
            IRepository<DisciplineTaxonomy, Guid> disciplineTaxonomyRepository,
            IDocumentsDomainService documentsDomainService)
        {
            _postRepository = postRepository;
            _postTopicRepository = postTopicRepository;
            _postAttachmentRepository = postAttachmentRepository;
            _disciplineTaxonomyRepository = disciplineTaxonomyRepository;
            _documentsDomainService = documentsDomainService;
        }


        public async Task<List<PostDto>> GetAllPosts(PostType? type)
        {
            return await _postRepository.GetAll()
                    .Include(p => p.CreatorUser)
                    .WhereIf(type.HasValue, p => p.Type == type)
                    .OrderByDescending(p => p.CreationTime)
                    .Select(p => ObjectMapper.Map<PostDto>(p))
                    .ToListAsync();
        }

        [AbpAuthorize(PermissionNames.Pages_Posts_Create)]
        public async Task Create([FromForm] CreatePostDto input)
        {
            var post = ObjectMapper.Map<Post>(input);
            var postId = await _postRepository.InsertAndGetIdAsync(post);

            if (input.NewTopics != null && input.NewTopics.Any())
            {
                var otherTopicParent = await _disciplineTaxonomyRepository.FirstOrDefaultAsync(x => x.Name == "Other Topics");
                if(otherTopicParent != null)
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
            return await _postRepository.GetAll()
                .Include(p => p.CreatorUser)
                .WhereIf(type.HasValue, p => p.Type == type)
                .Where(p => p.CreatorUserId == userId)
                .OrderByDescending(p => p.CreationTime)
                .Select(p => ObjectMapper.Map<PostDto>(p))
                .ToListAsync();
        }
    }
}
