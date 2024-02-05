using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("ServiceActivities")]
public class ServiceActivity : CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public Guid ServiceId { get; set; }
    public ActivityType ActivityType { get; set; }
    public int DisplayOrder { get; set; }
    
    [ForeignKey("CreatorUserId")]
    public User CreatorUser { get; set; }
}