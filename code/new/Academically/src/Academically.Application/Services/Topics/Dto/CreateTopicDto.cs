using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Topics.Dto
{
    [AutoMapTo(typeof(Topic))]
    public class CreateTopicDto
	{
        public string Name { get; set; }
    }
}

