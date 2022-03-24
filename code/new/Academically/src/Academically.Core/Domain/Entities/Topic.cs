using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyTopics")]
	public class Topic : Entity<Guid>
	{
        public string Name { get; set; }

        public virtual ICollection<ForumTopic> ForumTopics { get; set; }

		public Topic()
		{
			ForumTopics = new HashSet<ForumTopic>();
		}
	}
}

