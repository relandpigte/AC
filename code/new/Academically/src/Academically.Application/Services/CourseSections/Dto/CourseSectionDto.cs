using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Courses.Dto;
using Academically.Services.Documents.Dto;

namespace Academically.Services.CourseSections.Dto
{
    [AutoMap(typeof(CourseSection))]
    public class CourseSectionDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public CourseSectionType Type { get; set; }
        public CourseSectionStatus Status { get; set; }
        public int DisplayOrder { get; set; }
        public Guid CourseId { get; set; }
        public Guid? ParentId { get; set; }
        public bool IsVisible { get; set; }
        public bool IsAssignmentEnabled { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ImageDocumentId { get; set; }
        public string ApproximateLessonDuration { get; set; }
        public CourseSectionDripType? DripType { get; set; }
        public string DripValue { get; set; }
        public bool? IsSendEmailEnabled { get; set; }
        public string EmailSubject { get; set; }
        public string EmailMessage { get; set; }
        public CommentSetting? CommentSetting { get; set; }
        public bool? IsCommentModerationEnabled { get; set; }
        public bool? IsStorePreviewEnabled { get; set; }
        public bool IsPrerequsite { get; set; }
        public bool AreAllPrerequisite { get; set; }

        public DateTime CreationTime { get; set; }
        public string ImageDocumentUrl { get; set; }

        public CourseDto Course { get; set; }
        public DocumentDto ImageDocument { get; set; }

        public List<CourseSectionDto> Children { get; set; }
    }
}
