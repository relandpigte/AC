using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;
using Academically.Services.SpokenLanugages.Dto;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Events.Dto
{
    [AutoMapFrom(typeof(Event))]
    public class EventDto : EntityDto<Guid>
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
        public int Duration { get; set; }
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
        public ServiceDelayType? DelayType { get; set; }
        public string DelayValue { get; set; }

        public EventDto Parent { get; set; }
        public DocumentDto ThumbnailDocument { get; set; }
        public SpokenLanguageDto Language { get; set; }
        public UserDto CreatorUser { get; set; }

        public IEnumerable<EventDto> Children { get; set; }
    }
}
