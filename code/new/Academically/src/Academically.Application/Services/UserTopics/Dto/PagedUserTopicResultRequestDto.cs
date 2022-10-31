using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.UserTopics.Dto
{
    public class PagedUserTopicResultRequestDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
        public long UserId { get; set; }
        public UserTopicType Type { get; set; }
    }
}