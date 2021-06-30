using System;
using System.Collections.Generic;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.TutorWizard.Dto
{
    [AutoMap(typeof(TutorVerification))]
    public class TutorVerificationDto
    {
        public BecomeATutorStep CurrentStep { get; set; }
        public TutorVerificationStatus Status { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }

        public IEnumerable<TutorVerificationStepDto> TutorVerificationSteps { get; set; }
    }
}
