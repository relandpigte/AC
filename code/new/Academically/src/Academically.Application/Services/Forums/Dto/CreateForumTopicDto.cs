using System;

namespace Academically.Services.Forums.Dto
{
    public class CreateForumTopicDto
	{
        public Guid? TopicId { get; set; }
        public string TopicName { get; set; }
    }
}

