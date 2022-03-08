using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Articles.Dto
{
    public class PagedArticleResultRequestDto : PagedResultRequestDto
    {
        public long? UserIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public ArticleStatus? StatusFilter { get; set; }
    }
}

