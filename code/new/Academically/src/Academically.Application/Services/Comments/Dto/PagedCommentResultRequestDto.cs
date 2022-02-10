using Abp.Application.Services.Dto;
using System;

namespace Academically.Services.Comments.Dto
{
    public class PagedCommentResultRequestDto : PagedResultRequestDto
    {
        public Guid ParentIdFilter { get; set; }
    }
}
