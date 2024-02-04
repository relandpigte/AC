using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceFeatureFlag))]
public class ServiceFeatureFlagDto : CreationAuditedEntityDto<Guid>
{
    public Guid ReferenceId { get; set; }
    public ServicesType ServiceType { get; set; }
    public long? CreatorUserId { get; set; }
    
    public bool Attendees { get; set; }
    public bool Chat { get; set; }
    public bool Activities { get; set; }
    public bool Questions { get; set; }
    public bool Offers { get; set; }
    public bool Handouts { get; set; }
    public bool Comments { get; set; }
    public bool Reviews { get; set; }
    public bool Settings { get; set; }
}