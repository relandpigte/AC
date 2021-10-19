using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.CourseSectionPages.Dto
{
    [AutoMap(typeof(CourseSectionPage))]
    public class CourseSectionPageDto : EntityDto<Guid?>
    {
        public string PageContent { get; set; }
        public Guid CourseSectionId { get; set; }
    }
}
