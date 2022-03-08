using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Articles.Dto;
using System;

namespace Academically.Services.StudentArticles.Dto
{
    [AutoMap(typeof(StudentArticle))]
    public class StudentArticleDto : EntityDto<Guid>
    {
        public Guid ArticleId { get; set; }
        public bool SaveOnly { get; set; }
        public ArticleDto Article { get; set; }
    }
}
