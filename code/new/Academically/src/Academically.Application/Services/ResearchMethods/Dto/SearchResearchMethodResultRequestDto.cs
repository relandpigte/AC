using Abp.Application.Services.Dto;

namespace Academically.Services.ResearchMethods.Dto
{
    public class SearchResearchMethodResultRequestDto : LimitedResultRequestDto
    {
        public string SearchFilter { get; set; }
    }
}
