using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.UserAvailabilities.Dto;

[AutoMapTo(typeof(UserAvailabilitySetting))]
public class UserAvailabilitySettingDto
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
}