using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Events.Dto;

[AutoMapTo(typeof(Event))]
public class UpdateEventDetailsDto : EntityDto<Guid>
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Categories { get; set; }
    public Guid? ThumbnailDocumentId { get; set; }
    public Guid? LanguageId { get; set; }
    public PricingType? PricingType { get; set; }
    public decimal? Price { get; set; }
    public DateTime? EventDateTime { get; set; }
    public DateTime? EventDateTimeEnd { get; set; }
    public DateTime? EndDate { get; set; }
    public EventRecursionType RecursionType { get; set; }
    public IEnumerable<Guid> Topics { get; set; }
    public IEnumerable<string> NewTopics { get; set; }
}