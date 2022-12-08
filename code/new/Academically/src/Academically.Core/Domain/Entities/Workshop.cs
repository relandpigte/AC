using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyWorkshops")]
    public class Workshop : CreationAuditedEntity<Guid>
    {
        [NotMapped]
        public ServicesType ServiceType { get; set; } = ServicesType.Workshop;
        public WorkshopType Type { get; set; }
        public WorkshopStatus Status { get; set; }
        public Guid? ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public Guid? LanguageId { get; set; }
        public PricingType? PricingType { get; set; }
        public decimal? Price { get; set; }
        public WorkshopFrequencyType? FrequencyType { get; set; }
        public DateTime? WorkshopDateTime { get; set; }
        public DateTime? EndDate { get; set; }
        public int? Duration { get; set; }
        public ServiceDelayType? DelayType { get; set; }
        public string DelayValue { get; set; }
        public WorkshopRecursionType RecursionType { get; set; }
        public int? TimesPerDay { get; set; }
        public string SessionTimes { get; set; }
        public string SessionDaysOfWeek { get; set; }
        public string SessionDaysOfMonth { get; set; }
        public int? NumberOfAttendees { get; set; }
        public WorkshopReplayType? ReplayType { get; set; }
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
        public bool CohostsEnableMicrophone { get; set; }
        public bool CohostsEnableWebCam { get; set; }
        public bool CohostsEnablePresentationTools { get; set; }
        public bool CohostsEnableSpeakRequests { get; set; }
        public bool CohostsViewRegistrants { get; set; }
        public bool CohostsManageGuests { get; set; }
        public bool CohostsManageGuestSettings { get; set; }
        public bool CohostsManageAudience { get; set; }
        public bool CohostsManageAudienceSettings { get; set; }
        public bool CohostsChatPublicly { get; set; }
        public bool CohostsChatPubliclyTagMembers { get; set; }
        public bool CohostsChatPrivately { get; set; }
        public bool CohostsChatPrivatelySelected { get; set; }
        public bool CohostsAllowCohostsToUpvote { get; set; }
        public bool CohostsAllowCohostsToRespond { get; set; }
        public bool CohostsCreatePolls { get; set; }
        public bool CohostsCreateOffers { get; set; }
        public bool CohostsUploadHandouts { get; set; }
        public bool GuestsEnableMicrophone { get; set; }
        public bool GuestsEnableWebCam { get; set; }
        public bool GuestsEnablePresentationTools { get; set; }
        public bool GuestsEnableSpeakRequests { get; set; }
        public bool GuestsViewRegistrants { get; set; }
        public bool GuestsManageAudience { get; set; }
        public bool GuestsManageAudienceSettings { get; set; }
        public bool GuestsChatPublicly { get; set; }
        public bool GuestsChatPubliclyTagMembers { get; set; }
        public bool GuestsChatPrivately { get; set; }
        public bool GuestsChatPrivatelySelected { get; set; }
        public bool GuestsAllowGuestsToUpvote { get; set; }
        public bool GuestsAllowGuestsToRespond { get; set; }
        public bool GuestsCreatePolls { get; set; }
        public bool GuestsCreateOffers { get; set; }
        public bool GuestsCreateHandouts { get; set; }
        public bool AudienceEnableMicrophone { get; set; }
        public bool AudienceEnableWebCam { get; set; }
        public bool AudienceEnablePresentationTools { get; set; }
        public bool AudienceEnableSpeakRequests { get; set; }
        public bool AudienceViewAudience { get; set; }
        public bool AudienceChatPublicly { get; set; }
        public bool AudienceChatPubliclyTagMembers { get; set; }
        public bool AudienceChatPrivately { get; set; }
        public bool AudienceChatPrivatelySelected { get; set; }
        public bool AudienceAskQuestions { get; set; }
        public bool AudienceAskPublicQuestions { get; set; }
        public bool AudienceAskPublicQuestionsAllowAudienceToUpvote { get; set; }
        public bool AudienceAskPublicQuestionsAllowAudienceToRespond { get; set; }
        public bool AudienceAskPrivateQuestionsWithAdmins { get; set; }
        public bool AudienceAskPrivateQuestionsAllowFollowUpResponse { get; set; }
        public bool AudienceEnablePollsTab { get; set; }
        public bool AudienceEnableOffersTab { get; set; }
        public bool AudienceEnableOffersTabDisplayNoOfPurchases { get; set; }
        public bool AudienceEnableHandoutsTab { get; set; }

        [ForeignKey("ParentId")]
        public virtual Workshop Parent { get; set; }

        [ForeignKey("ThumbnailDocumentId")]
        public virtual Document ThumbnailDocument { get; set; }

        [ForeignKey("LanguageId")]
        public virtual SpokenLanguage Language { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<Workshop> Children { get; set; }

        public Workshop()
        {
            Status = WorkshopStatus.Draft;
            Children = new HashSet<Workshop>();
        }
    }
}
