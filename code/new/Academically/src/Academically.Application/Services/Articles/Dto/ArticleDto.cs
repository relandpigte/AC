using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Interfaces;
using Academically.Domain.Views;
using Academically.Services.Documents.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Articles.Dto
{
	[AutoMap(typeof(Article), typeof(ArticlePopularityViewModel))]
	public class ArticleDto : EntityDto<Guid>, IHasTopic, IHasCreationTime, IHasPopularityWeight, IHasThumbnail
	{
		public ArticleType Type { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public ArticleStatus Status { get; set; }
		public Guid? ParentId { get; set; }
		public Guid? ThumbnailDocumentId { get; set; }
		public Guid? LanguageId { get; set; }

		public bool IsVisible { get; set; }
		public CommentSetting CommentSetting { get; set; }
		public bool CommentModeration { get; set; }
		public string CustomUrl { get; set; }
		public string Category { get; set; }
		public string Categories { get; set; }
		public decimal Price { get; set; } = 0;
		public PricingType PricingType { get; set; }
		public DelayType? DelayType { get; set; }
		public string DelayValue { get; set; }

		public ArticleDto Parent { get; set; }
		public Document ThumbnailDocument { get; set; }

		public IEnumerable<ArticleDto> Children { get; set; }

		public DateTime CreationTime { get; set; }
		public UserDto CreatorUser { get; set; }
		public int PopularityWeight { get; set; }
        public string ThumbnailImageUrl { get; set; }
		public int ArticlesCount { get; set; } = 0;

        [NotMapped]
        public bool IsSaved { get; set; }

        public ArticleDto()
		{
		}
	}
}

