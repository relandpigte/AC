using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyVideos")]
	public class Video : CreationAuditedEntity<Guid>
	{
        public VideoType Type { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public VideoStatus Status { get; set; }
        public Guid? ParentId { get; set; }
        public Guid? DocumentId { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        [ForeignKey("ParentId")]
        public virtual Video Parent { get; set; }

        [ForeignKey("DocumentId")]
        public virtual Document Document { get; set; }

        public virtual ICollection<Video> Children { get; set; }

        public Video()
		{
            Children = new HashSet<Video>();
		}
	}
}

