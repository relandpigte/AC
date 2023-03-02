using Abp.Application.Services.Dto;
using System;

namespace Academically.Services.Comments.Dto
{
    public class PagedCommentResultRequestDto : PagedResultRequestDto
    {
        public string? ReferenceIdFilter { get; set; }
        public Guid? ParentIdFilter { get; set; }
    }
}
