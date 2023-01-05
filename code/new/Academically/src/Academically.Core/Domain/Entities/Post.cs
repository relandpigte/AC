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
			PostNotification = new HashSet<PostNotification>();
			PostVisibility = new HashSet<PostVisibility>();
            Children = new HashSet<Post>();
        }
        public string Title { get; set; }
		public string Content { get; set; }
		public Guid? SpaceId { get; set; }
		public Guid? ServiceId { get; set; }
		public PostType Type { get; set; }
		public Guid? ParentId { get; set; }
        public bool IsHidden { get; set; }

        [ForeignKey("CreatorUserId")]
		public virtual User CreatorUser { get; set; }
        [ForeignKey("ParentId")]
        public virtual Post Parent { get; set; }

        public virtual ICollection<PostTopic> PostTopics { get; set; }
		public virtual ICollection<PostAttachment> PostAttachments { get; set; }
		public virtual ICollection<PostNotification> PostNotification { get; set; }
		public virtual ICollection<PostVisibility> PostVisibility { get; set; }
        public virtual ICollection<Post> Children { get; set; }
    }
}

