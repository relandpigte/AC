using System;
using System.Collections.Generic;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;

namespace Academically.Services.TutorWizard.Dto
{
    [AutoMap(typeof(TutorVerification))]
    public class TutorVerificationDto : CreationAuditedEntity<Guid>
    {
        public BecomeATutorStep CurrentStep { get; set; }
        public TutorVerificationStatus Status { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }

        public UserDto CreatorUser { get; set; }
        public IEnumerable<TutorVerificationStepDto> TutorVerificationSteps { get; set; }
    }
}
