using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities;

[Table("EventRatings")]
public class EventRating : CreationAuditedEntity<Guid>
{
    public Guid EventId { get; set; }
    public string Comments { get; set; }
    public int Rating { get; set; }

    [ForeignKey("EventId")]
    public virtual Event Event { get; set; }

    [ForeignKey("CreatorUserId")]
    public virtual User Reviewer { get; set; }
}