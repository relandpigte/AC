namespace Academically.Services.Ratings.Dto
{
    public class StudentRatingSummaryDto
    {
        public decimal PositivePercentage { get; set; }
        public int TotalReviews { get; set; }
        public int TotalPositiveReviews { get; set; }
        public int TotalNeutralReviews { get; set; }
        public int TotalNegativeReviews { get; set; }
    }
}
