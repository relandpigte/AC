using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using AutoMapper;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceBooking))]
public class ServiceBookingDto : EntityDto<Guid>
{
    public Guid ReferenceId { get; set; }
    public DateTime BookingDateTime { get; set; }
    public DateTime? OldBookingDateTime { get; set; }
    public long OwnerId { get; set; }
    public string RescheduleReason { get; set; }
    public string CancellationReason { get; set; }
    public long? UserCancelled { get; set; }
    public DateTime? CancellationTime { get; set; }
    public ServicesType? Type { get; set; }
    public long? CreatorUserId { get; set; }
    
    public UserDto CreatorUser { get; set; }
}