using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.GuardianProfiles.Dto
{
    [AutoMap(typeof(GuardianConsentProfile))]
    public class GuardianConsentProfileDto : EntityDto<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string IPAddress { get; set; }
        public SourceType SourceType { get; set; }
        public DateTime? ConsentedDate { get; set; }
        public bool? HasExpired { get; set; }
    }
}
