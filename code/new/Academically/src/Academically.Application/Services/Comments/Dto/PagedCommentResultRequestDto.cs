using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Comments.Dto
{
    public class PagedCommentResultRequestDto : PagedResultRequestDto
    {
        public string? ReferenceIdFilter { get; set; }
        public Guid? ParentIdFilter { get; set; }
        public PostSort? PostSort { get; set; }
        public Guid? NotificationId { get; set; }
    }
}
