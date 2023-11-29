using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using AutoMapper;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceBooking))]
public class ServiceBookingDto : EntityDto<Guid>
{
    public Guid ReferenceId { get; set; }
    public DateTime BookingDateTime { get; set; }
    public long OwnerId { get; set; }
    public string RescheduleReason { get; set; }
    public string CancellationReason { get; set; }
    public DateTime? CancellationTime { get; set; }
    public ServicesType? Type { get; set; }
    public long CreatorUserId { get; set; }
}