using System;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Coachings.Dto;

[AutoMapFrom(typeof(ServicePresentation))]
public class ServicePresentationDto : CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public ServicesType ServiceType { get; set; }
    public int? DisplayOrder { get; set; }
    
    public long CreatorUserId { get; set; }
    public UserDto CreatorUser { get; set; }
    
    public Guid DocumentId { get; set; }
    public DocumentDto Document { get; set; }
}