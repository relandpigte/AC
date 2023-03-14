using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
	[Table("EventResources")]
    public class EventResource : CreationAuditedEntity<Guid>
	{
        public string Name { get; set; }
        public EventResourceType Type { get; set; }
        public Guid EventId { get; set; }
        public Guid? DocumentId { get; set; }

        [ForeignKey("EventId")]
        public Event Event { get; set; }
        [ForeignKey("DocumentId")]
        public Document Document { get; set; }
        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }

        public EventResource()
		{
		}
	}
}

