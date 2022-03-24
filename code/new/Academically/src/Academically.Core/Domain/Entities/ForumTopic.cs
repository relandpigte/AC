using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyForumTopics")]
	public class ForumTopic : Entity<Guid>
	{
        public Guid ForumId { get; set; }
        public Guid TopicId { get; set; }

        public virtual Forum Forum { get; set; }
        public virtual Topic Topic { get; set; }
    }
}

