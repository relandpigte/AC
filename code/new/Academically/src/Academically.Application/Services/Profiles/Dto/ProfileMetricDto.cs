namespace Academically.Services.Profiles.Dto
{
    public class ProfileMetricDto
    {
        public int TotalHours { get; set; }
        public string TotalHoursChange { get; set; }
        public string AcademicLevel { get; set; }
        public string UserType { get; set; }
        public decimal PositiveReviewsPercentage { get; set; }
        public int TotalReviews { get; set; }
    }
}
