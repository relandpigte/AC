using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Comments.Dto
{
    public class PagedGetAllPostsDto : PagedResultRequestDto
    {
        public PostType? Type { get; set; }
        public Guid? ParentId { get; set; }
        public DateTime? CreationTime { get; set; }
    }
}
