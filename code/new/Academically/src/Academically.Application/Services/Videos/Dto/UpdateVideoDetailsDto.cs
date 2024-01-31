using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System.Collections.Generic;

namespace Academically.Services.Videos.Dto
{
    [AutoMap(typeof(Video))]
	public class UpdateVideoDetailsDto
	{
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public string Categories { get; set; }

        public Guid? LanguageId { get; set; }

        public decimal Price { get; set; }
        public PricingType PricingType { get; set; }
        public IEnumerable<Guid> Topics { get; set; }
        public IEnumerable<string> NewTopics { get; set; }
    }
}

