using System;
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

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public Video()
		{
		}
	}
}

