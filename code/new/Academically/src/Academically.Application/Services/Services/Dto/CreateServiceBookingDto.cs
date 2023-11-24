using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMapTo(typeof(ServiceBooking))]
public class CreateServiceBookingDto
{
    public Guid ReferenceId { get; set; }
    public DateTime BookingDateTime { get; set; }
    public long OwnerId { get; set; }
    public ServicesType? Type { get; set; }
}