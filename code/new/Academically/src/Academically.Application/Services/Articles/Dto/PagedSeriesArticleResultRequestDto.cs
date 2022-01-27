using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Articles.Dto
{
	public class PagedSeriesArticleResultRequestDto : PagedResultRequestDto
	{
        public Guid ParentIdFilter { get; set; }
        public string SearchFilter { get; set; }
        public ArticleStatus? StausFilter { get; set; }
    }
}

