using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("ServiceReviews")]
public class ServiceReview: CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public int Rating { get; set; }
    public string Comments { get; set; }
    public long ServiceOwnerId { get; set; }
    public ServicesType ServiceType { get; set; }
    public DateTime CreationTime { get; set; }
    
    [ForeignKey("CreatorUserId")]
    public virtual User CreatorUser { get; set; }
}