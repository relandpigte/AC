using Abp.Application.Services.Dto;
using Academically.Entities.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.GuardianProfiles.Dto
{
    public class GuardianConsentProfileDto : EntityDto<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string IPAddress { get; set; }
        public string ReferenceId { get; set; }
        public SourceType SourceType { get; set; }
        public DateTime ConsentedDate { get; set; }
    }
}
