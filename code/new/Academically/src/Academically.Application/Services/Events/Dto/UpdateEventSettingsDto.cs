using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Events.Dto
{
    [AutoMap(typeof(Event))]
    public class UpdateEventSettingsDto : EntityDto<Guid>
    {
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
    }
}
