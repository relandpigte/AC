namespace Academically.Services.Services.Dto;

public class ServiceReviewStats
{
    public decimal OneStars { get; set; }
    public decimal TwoStars { get; set; }
    public decimal ThreeStars { get; set; }
    public decimal FourStars { get; set; }
    public decimal FiveStars { get; set; }
    public int TotalReviews { get; set; }
    public decimal OverallRatings { get; set; }
}