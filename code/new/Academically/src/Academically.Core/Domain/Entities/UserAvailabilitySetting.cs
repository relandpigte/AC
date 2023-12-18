using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("UserAvailabilitySettings")]
public class UserAvailabilitySetting : CreationAuditedEntity<Guid>
{
    public int BookingIntervals { get; set; }
    
    public bool IsMaximumBookingPerDay { get; set; }
    public int MaximumBookingPerDay { get; set; }
    
    public int Padding { get; set; }
    
    public bool IsMinimumBookingNotice { get; set; }
    public int MinimumBookingNotice { get; set; }
    public AvailabilityUnit MinimumBookingNoticeUnit { get; set; }
    
    public bool IsMaximumAdvanceNotice { get; set; }
    public int MaximumAdvanceNotice { get; set; }
    public AvailabilityUnit MaximumAdvanceNoticeUnit { get; set; }
    
    public DayOfWeek WeekStartDay { get; set; }
    
    [ForeignKey("CreatorUserId")]
    public virtual User CreatorUser { get; set; }
}