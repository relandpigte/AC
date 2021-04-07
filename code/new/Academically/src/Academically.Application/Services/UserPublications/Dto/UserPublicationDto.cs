using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserPublications.Dto
{
    [AutoMap(typeof(UserPublication))]
    public class UserPublicationDto : EntityDto<Guid?>
    {
        public string Title { get; set; }
        public PublicationType PublicationType { get; set; }
        public string Publisher { get; set; }
        public DateTime PublicationDate { get; set; }
        public string Abstract { get; set; }
        public DateTime CreationTime { get; set; }

        public IEnumerable<string> Tags { get; set; }
        public virtual ICollection<UserPublicationTagDto> UserPublicationTags { get; set; }
    }
}
