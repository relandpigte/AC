using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities;

[Table("ChannelMessageVisibility")]
public class ChannelMessageVisibility: CreationAuditedEntity<Guid>
{
    public Guid ChannelMessageId { get; set; }
    
    [ForeignKey("ChannelMessageId")]
    public virtual ChannelMessage ChannelMessage { get; set; }
    
    [ForeignKey("CreatorUserId")]
    public virtual User User { get; set; }
}