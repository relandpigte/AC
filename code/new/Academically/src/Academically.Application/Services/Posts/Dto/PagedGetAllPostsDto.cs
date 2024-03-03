using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Academically.Services.Comments.Dto
{
    public class PagedGetAllPostsDto : PagedResultRequestDto
    {
        public PostType? Type { get; set; }
        public Guid? ParentId { get; set; }
        public DateTime? CreationTime { get; set; }
        public IEnumerable<string> TopicIds { get; set; }
        public PostSort? PostSort { get; set; }
        public Guid? NotificationId { get; set; }
    }
}
