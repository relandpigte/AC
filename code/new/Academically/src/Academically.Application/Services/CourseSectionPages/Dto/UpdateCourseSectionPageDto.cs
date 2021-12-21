using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.CourseSectionPages.Dto
{
    [AutoMap(typeof(CourseSectionPage))]
    public class UpdateCourseSectionPageDto: EntityDto<Guid?>
    {
        public string Description { get; set; }
        public string CategoriesTags { get; set; }
        public string Duration { get; set; }

        public IFormFile File { get; set; }

        public Guid CourseSectionId { get; set; }
    }
}
