using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Academically.Domain.Entities;

[Table("VideoAttachments")]
public class VideoAttachment : CreationAuditedEntity<Guid>
{
    public Guid VideoId { get; set; }
    public Guid DocumentId { get; set; }
    public int DisplayOrder { get; set; }

    [ForeignKey("VideoId")]
    public virtual Video Video { get; set; }

    [ForeignKey("DocumentId")]
    public virtual Document Document { get; set; }
}