using Abp.Application.Services.Dto;
using System;

namespace Academically.Services.Questions.Dto
{
    public class PagedQuestionResultRequestDto : PagedResultRequestDto
    {
        public Guid ParentIdFilter { get; set; }
    }
}
