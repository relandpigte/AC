using Academically.Domain.Enums;

namespace Academically.Services.UserTopics.Dto
{
    public class GetAllUserTopicResultRequestDto
    {
        public string Keyword { get; set; }
        public long UserId { get; set; }
        public UserTopicType Type { get; set; }
        public string Sorting { get; set; }
    }
}