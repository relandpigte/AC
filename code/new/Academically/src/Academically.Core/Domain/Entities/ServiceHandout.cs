using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("ServiceHandouts")]
public class ServiceHandout : CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public Guid DocumentId { get; set; }
    public ServicesType? ServiceType { get; set; }
    public int? DisplayOrder { get; set; }
    public DateTime? ShareTime { get; set; }
    public long? UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User? User { get; set; }

    [ForeignKey("CreatorUserId")]
    public virtual User CreatorUser { get; set; }

    [ForeignKey("DocumentId")]
    public virtual Document Document { get; set; }
}