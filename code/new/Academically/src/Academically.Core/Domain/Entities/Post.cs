using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyPosts")]
	public class Post : FullAuditedEntity<Guid>
    {
		public Post()
		{
			PostTopics = new HashSet<PostTopic>();
			PostAttachments = new HashSet<PostAttachment>();
		}

		public string Title { get; set; }
		public string Content { get; set; }
		public Guid? SpaceId { get; set; }
		public PostType Type { get; set; }

		[ForeignKey("CreatorUserId")]
		public virtual User CreatorUser { get; set; }

		public virtual ICollection<PostTopic> PostTopics { get; set; }
		public virtual ICollection<PostAttachment> PostAttachments { get; set; }
	}
}

