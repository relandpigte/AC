using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.StudentArticles.Dto
{
    [AutoMapFrom(typeof(StudentArticle))]
    public class GetStudentArticleDto : EntityDto<Guid>
    {
        public Guid ArticleId { get; set; }
        public bool SaveOnly { get; set; }
        public long CreatorUserId { get; set; }
    }
}
