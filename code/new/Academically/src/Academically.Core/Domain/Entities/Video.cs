using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("Videos")]
	public class Video : CreationAuditedEntity<Guid>, ISimpleService
    {
        [NotMapped]
        public ServicesType ServiceType { get; set; } = ServicesType.Tutorial;
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
        public string Categories { get; set; }
        public decimal? Price { get; set; }
        public PricingType PricingType { get; set; }
        public ServiceDelayType? DelayType { get; set; }
        public string DelayValue { get; set; }

        [ForeignKey("LanguageId")]
        public virtual SpokenLanguage Language { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ParentId")]
        public virtual Video Parent { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }

        [ForeignKey("ThumbnailDocumentId")]
        public virtual Document ThumbnailDocument { get; set; }

        public virtual ICollection<Video> Children { get; set; }
        public virtual ICollection<VideoAttachment> VideoAttachments { get; set; }

        public Video()
		{
            Children = new HashSet<Video>();
		}
	}
}

