using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("AcademicallyWorkshopResources")]
    public class WorkshopResource : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }
        public WorkshopResourceType Type { get; set; }
        public Guid WorkshopId { get; set; }
        public Guid? DocumentId { get; set; }

        [ForeignKey("WorkshopId")]
        public Workshop Workshop { get; set; }

        [ForeignKey("DocumentId")]
        public Document Document { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public WorkshopResource()
		{
		}
	}
}

