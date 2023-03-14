using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("StudentArticles")]
    public class StudentArticle : CreationAuditedEntity<Guid>
    {
        public Guid ArticleId { get; set; }
        public bool SaveOnly { get; set; }

        [ForeignKey("ArticleId")]
        public virtual Article Article { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }
    }
}
