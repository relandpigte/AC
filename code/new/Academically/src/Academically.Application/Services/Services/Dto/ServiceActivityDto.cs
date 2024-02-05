using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceActivity))]
public class ServiceActivityDto : CreationAuditedEntityDto<Guid>
{
    public Guid ReferenceId { get; set; }
    public Guid ServiceId { get; set; }
    public ActivityType ActivityType { get; set; }
    public int DisplayOrder { get; set; }
    
    [NotMapped]
    public ServiceQuizDto Quiz { get; set; }
    
    [NotMapped]
    public ServicePollDto Poll { get; set; }
}