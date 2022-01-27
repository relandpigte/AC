using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Articles.Dto
{
	[AutoMap(typeof(Article))]
	public class UpdateArticleDetailsDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? LanguageId { get; set; }
        public PricingType PricingType { get; set; }

        public IFormFile ThumbnailDocumentFile { get; set; }
    }
}

