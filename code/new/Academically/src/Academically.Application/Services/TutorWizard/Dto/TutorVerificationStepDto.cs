using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.TutorWizard.Dto
{
    [AutoMap(typeof(TutorVerificationStep))]
    public class TutorVerificationStepDto
    {
        public BecomeATutorStep Step { get; set; }
        public TutorVerificationStepStatus Status { get; set; }
        public DateTime? ReviewTime { get; set; }
        public long? ReviewerUserId { get; set; }
        public Guid TutorVerificationId { get; set; }
    }
}
