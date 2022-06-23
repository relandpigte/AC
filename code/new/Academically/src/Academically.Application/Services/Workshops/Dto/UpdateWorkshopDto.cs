using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Workshops.Dto
{
    [AutoMapTo(typeof(Workshop))]
    public class UpdateWorkshopDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public Guid? LanguageId { get; set; }
        public PricingType? PricingType { get; set; }
        public decimal? Price { get; set; }
    }
}
