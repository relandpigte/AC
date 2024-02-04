using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("ServiceFeatureFlags")]
public class ServiceFeatureFlag : CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public ServicesType ServiceType { get; set; }
    
    public bool Attendees { get; set; }
    public bool Chat { get; set; }
    public bool Activities { get; set; }
    public bool Questions { get; set; }
    public bool Offers { get; set; }
    public bool Handouts { get; set; }
    public bool Comments { get; set; }
    public bool Reviews { get; set; }
    public bool Settings { get; set; }
    
    [ForeignKey("CreatorUserId")]
    public User CreatorUser { get; set; }
}