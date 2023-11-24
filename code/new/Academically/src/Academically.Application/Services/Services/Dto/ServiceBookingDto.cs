using System;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using AutoMapper;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceBooking))]
public class ServiceBookingDto
{
    public Guid ReferenceId { get; set; }
    public DateTime BookingDateTime { get; set; }
    public long OwnerId { get; set; }
    public string RescheduleReason { get; set; }
    public ServicesType? Type { get; set; }
    public long CreatorUserId { get; set; }
}