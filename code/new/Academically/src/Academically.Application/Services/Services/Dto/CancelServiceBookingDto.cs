using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMapTo(typeof(ServiceBooking))]
public class CancelServiceBookingDto
{
    public Guid? Id { get; set; }
    public Guid ReferenceId { get; set; }
    public string CancellationReason { get; set; }
    public DateTime CancellationTime { get; set; }
    public long UserCancelled { get; set; }
}