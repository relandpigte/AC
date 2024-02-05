using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMapTo(typeof(ServiceActivity))]
public class CreateServiceActivityDto
{
    public Guid ReferenceId { get; set; }
    public Guid ServiceId { get; set; }
    public ActivityType ActivityType { get; set; }
}