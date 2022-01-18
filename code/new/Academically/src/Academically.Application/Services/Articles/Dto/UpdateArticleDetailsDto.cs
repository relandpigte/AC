using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.Articles.Dto
{
	[AutoMap(typeof(Article))]
	public class UpdateArticleDetailsDto
	{
        public Guid Id { get; set; }
		public IFormFile ThumbnailFile { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public string Categories { get; set; }

        public Guid? LanguageId { get; set; }

        public decimal Price { get; set; }
        public PricingType PricingType { get; set; }
    }
}

