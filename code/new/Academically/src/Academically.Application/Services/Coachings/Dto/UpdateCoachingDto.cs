using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Academically.Services.Coachings.Dto
{
    [AutoMapTo(typeof(Coaching))]
    public class UpdateCoachingDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public Guid? LanguageId { get; set; }
        public PricingType? PricingType { get; set; }
        public decimal? Price { get; set; }
        public int? CancellationPeriod { get; set; }
        public int SessionLength { get; set; }
        public IEnumerable<Guid> Topics { get; set; }
        public IEnumerable<string> NewTopics { get; set; }
    }
}
