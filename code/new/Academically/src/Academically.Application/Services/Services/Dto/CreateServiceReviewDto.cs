using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMapTo(typeof(ServiceReview))]
public class CreateServiceReviewDto
{
    public Guid ReferenceId { get; set; }
    public int Rating { get; set; }
    public string Comments { get; set; }
    public long ServiceOwnerId { get; set; }
    public ServicesType ServiceType { get; set; }
}