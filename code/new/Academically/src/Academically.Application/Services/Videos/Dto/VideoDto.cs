using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Interfaces;
using Academically.Services.Documents.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Videos.Dto
{
	[AutoMap(typeof(Video))]
	public class VideoDto : CreationAuditedEntityDto<Guid>, IHasTopic, IHasCreationTime, IHasThumbnail
	{
		public VideoType Type { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public VideoStatus Status { get; set; }
		public Guid? ParentId { get; set; }
		public Guid? DocumentId { get; set; }
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
		public ServiceDelayType? DelayType { get; set; }
		public string DelayValue { get; set; }
        public int VideoCount { get; set; }
        public int VideoLength { get; set; }
        public float Rating { get; set; }
        public int Reviews { get; set; }

        public VideoDto Parent { get; set; }
		public DocumentDto Document { get; set; }
		public Document ThumbnailDocument { get; set; }
        public UserDto CreatorUser { get; set; }

        public IEnumerable<VideoDto> Children { get; set; }

        public int LikeCount { get; set; }
        public string ThumbnailImageUrl { get; set; }

        public VideoDto()
		{
		}
	}
}

