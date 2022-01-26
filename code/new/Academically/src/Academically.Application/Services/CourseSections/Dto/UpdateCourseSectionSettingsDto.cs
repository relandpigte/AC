using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.CourseSections.Dto
{
	[AutoMap(typeof(CourseSection))]
	public class UpdateCourseSectionSettingsDto : EntityDto<Guid>
    {
        public CourseSectionDripType? DripType { get; set; }
        public string DripValue { get; set; }
        public bool? IsSendEmailEnabled { get; set; }
        public string EmailSubject { get; set; }
        public string EmailMessage { get; set; }
        public bool IsVisible { get; set; }
        public CommentSetting? CommentSetting { get; set; }
        public bool? IsCommentModerationEnabled { get; set; }
        public bool? IsStorePreviewEnabled { get; set; }
        public bool IsPrerequsite { get; set; }
        public bool AreAllPrerequisite { get; set; }
        public bool IsAssignmentEnabled { get; set; }
    }
}

