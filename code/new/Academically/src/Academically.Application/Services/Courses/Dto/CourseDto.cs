using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Interfaces;
using Academically.Domain.Views;
using Academically.Services.Documents.Dto;
using Academically.Services.StudentCourses.Dto;
using Academically.Users.Dto;

namespace Academically.Services.Courses.Dto
{
    [AutoMap(typeof(Course), typeof(CoursePopularityViewModel))]
    public class CourseDto : EntityDto<Guid>, IHasTopic, IHasThumbnail, IHasCreationTime, IHasPopularityWeight
    {

        public string Name { get; set; }
        public string Subtitle { get; set; }
        public string Description { get; set; }
        public CourseStatus Status { get; set; }
        public decimal Price { get; set; }
        public CourseType Type { get; set; }
        public bool IsVisible { get; set; }
        public bool IsOpen { get; set; }
        public Guid? ImageDocumentId { get; set; }
        public Guid? CurrencyId { get; set; }
        public Guid? LanguageId { get; set; }
        public string Categories { get; set; }
        public PricingType? PricingType { get; set; }
        public int? NumberOfPlaces { get; set; }
        public DateTime? StartDate { get; set; }
        public string StartTime { get; set; }
        public DateTime? EndDate { get; set; }
        public string EndTime { get; set; }
        public CommentSetting? CommentsVisibility { get; set; }
        public bool? CommentsNeedAdminApproval { get; set; }

        public DateTime CreationTime { get; set; }
        public string CourseImageUrl { get; set; }
        public string ThumbnailImageUrl { get; set; }

        public UserDto CreatorUser { get; set; }
        public DocumentDto ImageDocument { get; set; }

        public IEnumerable<StudentCourseDto> StudentCourses { get; set; }
        public int PopularityWeight { get; set; }
        public int Modules { get; set; }
        public int Lessons { get; set; }
        public decimal Progress { get; set; }
        public int Units { get; set; }

        [NotMapped]
        public bool IsSaved { get; set; }

        [NotMapped]
        public bool IsPurchased { get; set; }

        [NotMapped]
        public bool HasReviewed { get; set; }
        
        [NotMapped]
        public IEnumerable<UserDto> Enrolled { get; set; }
        
    }
}
