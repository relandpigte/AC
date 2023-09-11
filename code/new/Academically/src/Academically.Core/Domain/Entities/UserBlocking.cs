using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities;

[Table("UserBlockings")]
public class UserBlocking: CreationAuditedEntity<Guid>
{
    public long BlockedUserId { get; set; }
    
    [ForeignKey("CreatorUserId")]
    public virtual User CreatorUser { get; set; }
    
    [ForeignKey("BlockedUserId")]
    public virtual User BlockedUser { get; set; }
}