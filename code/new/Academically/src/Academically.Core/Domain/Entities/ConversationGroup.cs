using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("ConversationGroups")]
    public class ConversationGroup : Entity<Guid>
    {
        public ConversationGroup()
        {
            Conversations = new HashSet<Conversation>();
        }

        public string Name { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? CalendarEventId { get; set; }
        public DateTime? LastConversationCreationTime { get; set; }
        public long? LastConversationCreatorUserId { get; set; }
        public string LastConversationMessage { get; set; }


        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }
        [ForeignKey("CalendarEventId")]
        public virtual CalendarEvent CalendarEvent { get; set; }

        public virtual ICollection<Conversation> Conversations { get; set; }
    }
}
