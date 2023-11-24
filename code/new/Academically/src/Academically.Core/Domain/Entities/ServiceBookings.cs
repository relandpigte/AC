using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("ServiceBookings")]
public class ServiceBooking: CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public DateTime BookingDateTime { get; set; }
    public long OwnerId { get; set; }
    public string RescheduleReason { get; set; }
    public ServicesType? Type { get; set; }

    [ForeignKey("CreatorUserId")]
    public virtual User CreatorUser { get; set; }
}