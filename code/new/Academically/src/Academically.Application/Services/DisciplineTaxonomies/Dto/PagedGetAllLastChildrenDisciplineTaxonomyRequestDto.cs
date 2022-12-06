using Abp.Application.Services.Dto;

namespace Academically.Services.Articles.Dto
{
    public class PagedGetAllLastChildrenDisciplineTaxonomyRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public bool ExcludeFollowing { get; set; }
        public bool IncludeChildren { get; set; }
        public int? Take { get; set; }
    }
}