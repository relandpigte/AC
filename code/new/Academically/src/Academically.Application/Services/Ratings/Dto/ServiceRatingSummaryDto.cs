namespace Academically.Services.Ratings.Dto;

public class ServiceRatingSummaryDto : StudentRatingSummaryDto
{
    public decimal TotalRatingPercentage { get; set; }
    public decimal TotalCommunicationRatings { get; set; }
    public decimal TotalValueForMoneyRatings { get; set; }
    public decimal TotalPunctualityRatings { get; set; }
    public decimal TotalProfessionalismsRating { get; set; }
    public decimal TotalKnowledgeRatings { get; set; }
}