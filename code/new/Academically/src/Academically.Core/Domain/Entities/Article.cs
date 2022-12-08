using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyArticles")]
    public class Article : CreationAuditedEntity<Guid>
    { 
        [NotMapped]
        public ServicesType ServiceType { get; set; } = ServicesType.Articles;
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
        public string Categories { get; set; }
        public DelayType? DelayType { get; set; }
        public string DelayValue { get; set; }


        public decimal Price { get; set; }
        public PricingType PricingType { get; set; }

        [ForeignKey("LanguageId")]
        public virtual SpokenLanguage Language { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ParentId")]
        public virtual Article Parent { get; set; }

        [ForeignKey("ThumbnailDocumentId")]
        public virtual Document ThumbnailDocument { get; set; }

        public virtual ICollection<Article> Children { get; set; }

        public Article()
        {
            Children = new HashSet<Article>();
        }
    }
}

