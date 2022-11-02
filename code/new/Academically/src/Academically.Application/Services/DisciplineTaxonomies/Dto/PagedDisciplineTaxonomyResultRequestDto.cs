using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Articles.Dto
{
    public class PagedDisciplineTaxonomyResultRequestDto : PagedAndSortedResultRequestDto
    {
        public Guid? ParentId { get; set; }
        public string Keyword { get; set; }
        public bool IncludeChildren { get; set; }
        public bool ExcludeFollowing { get; set; }
    }
}