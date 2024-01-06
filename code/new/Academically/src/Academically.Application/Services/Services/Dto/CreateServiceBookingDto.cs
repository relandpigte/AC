using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMapTo(typeof(ServiceBooking))]
public class CreateServiceBookingDto: CreationAuditedEntityDto<Guid>
{
    public Guid ReferenceId { get; set; }
    public DateTime BookingDateTime { get; set; }
    public DateTime? OldBookingDateTime { get; set; }
    public long OwnerId { get; set; }
    public string RescheduleReason { get; set; }
    public ServicesType? Type { get; set; }
    public long? CreatorUserId { get; set; }
}