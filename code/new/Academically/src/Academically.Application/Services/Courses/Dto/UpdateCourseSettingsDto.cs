using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Courses.Dto
{
    [AutoMapTo(typeof(Course))]
    public class UpdateCourseSettingsDto : EntityDto<Guid>
    {
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }
        public CourseType Type { get; set; }
        public int? NumberOfPlaces { get; set; }
        public DateTime? StartDate { get; set; }
        public string StartTime { get; set; }
        public DateTime? EndDate { get; set; }
        public string EndTime { get; set; }
        public CommentSetting? CommentsVisibility { get; set; }
        public bool? CommentsNeedAdminApproval { get; set; }
    }
}
