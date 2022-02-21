using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyEvents")]
    public class Event : CreationAuditedEntity<Guid>
    {
        public EventType Type { get; set; }
        public EventStatus Status { get; set; }
        public Guid? ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public Guid? LanguageId { get; set; }
        public PricingType? PricingType { get; set; }
        public EventFrequencyType? FrequencyType { get; set; }
        public DateTime? EventDateTime { get; set; }
        public int? Duration { get; set; }
        public EventReplayType? ReplayType { get; set; }
        public bool? QuestionsEnabled { get; set; }
        public QuestionType? QuestionType { get; set; }
        public bool? AttendeesCanUpvote { get; set; }
        public bool? AttendeesCanRespond { get; set; }
        public bool? ChatEnabled { get; set; }
        public string CustomWebinarUrl { get; set; }
        public bool? RegistrationEmailNotification { get; set; }
        public bool? TwentyFourHourReminderNotification { get; set; }
        public bool? OneHourReminderNotification { get; set; }
        public bool? FifteenMinuteReminderNotification { get; set; }
        public bool? ReplayFollowUpNotification { get; set; }
        public bool? Visible { get; set; }
        public bool? Opened { get; set; }

        [ForeignKey("ParentId")]
        public virtual Event Parent { get; set; }
        [ForeignKey("ThumbnailDocumentId")]
        public virtual Document ThumbnailDocument { get; set; }
        [ForeignKey("LanguageId")]
        public virtual SpokenLanguage Language { get; set; }
        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<Event> Children { get; set; }

        public Event()
        {
            Status = EventStatus.Draft;
            Children = new HashSet<Event>();
        }
    }
}
