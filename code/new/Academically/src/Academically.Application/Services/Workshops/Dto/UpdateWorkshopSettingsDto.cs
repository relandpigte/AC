using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Workshops.Dto
{
    [AutoMap(typeof(Workshop))]
    public class UpdateWorkshopSettingsDto : EntityDto<Guid>
    {
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

    }
}
