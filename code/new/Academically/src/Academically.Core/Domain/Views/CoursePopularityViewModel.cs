using Academically.Domain.Entities;
using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Domain.Views
{
    public class CoursePopularityViewModel : Course, IHasPopularityWeight
    {
        public CoursePopularityViewModel() { }
        public CoursePopularityViewModel(Course course, int popularityPoints)
        {
            Id = course.Id;
            Name = course.Name;
            Subtitle = course.Subtitle;
            Description = course.Description;
            Status = course.Status;
            Price = course.Price;
            Type = course.Type;
            IsVisible = course.IsVisible;
            IsOpen = course.IsOpen;
            ImageDocumentId = course.ImageDocumentId;
            LanguageId = course.LanguageId;
            CurrencyId = course.CurrencyId;
            Categories = course.Categories;
            PricingType = course.PricingType;
            NumberOfPlaces = course.NumberOfPlaces;
            StartDate = course.StartDate;
            StartTime = course.StartTime;
            EndDate = course.EndDate;
            EndTime = course.EndTime;
            CommentsVisibility = course.CommentsVisibility;
            CommentsNeedAdminApproval = course.CommentsNeedAdminApproval;
            ImageDocument = course.ImageDocument;
            Language = course.Language;
            Currency = course.Currency;
            CreatorUser = course.CreatorUser;
            StudentCourses = course.StudentCourses;
            PopularityWeight = popularityPoints;
            CreationTime = course.CreationTime;
            CreatorUserId = course.CreatorUserId;

        }

        public int PopularityWeight { get; set; }
    }
}
