using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.UserEducations.Dto
{
    [AutoMap(typeof(AcademicLevelQualification))]
    public class AcademicLevelQualificationDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public int DisplayOrder { get; set; }
        public Guid AcademicLevelId { get; set; }
        public long? ReviewerUserId { get; set; }
        public DateTime? ReviewTime { get; set; }
        public AcademicLevelQualificationReviewStatus ReviewStatus { get; set; }
    }
}
