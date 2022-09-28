using Academically.Domain.Entities;
using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Domain.Views
{
    public class CoachingPopularityViewModel : Coaching, IHasPopularityWeight
    {
        public CoachingPopularityViewModel()
        {

        }

        public CoachingPopularityViewModel(Coaching coaching, int popularityPoints)
        {
            Id = coaching.Id;
            Type = coaching.Type;
            Status = coaching.Status;
            ParentId = coaching.ParentId;
            Name = coaching.Name;
            Description = coaching.Description;
            Categories = coaching.Categories;
            ThumbnailDocumentId = coaching.ThumbnailDocumentId;
            LanguageId = coaching.LanguageId;
            PricingType = coaching.PricingType;
            Price = coaching.Price;
            ReplayType = coaching.ReplayType;
            QuestionsEnabled = coaching.QuestionsEnabled;
            QuestionType = coaching.QuestionType;
            AttendeesCanUpvote = coaching.AttendeesCanUpvote;
            AttendeesCanRespond = coaching.AttendeesCanRespond;
            ChatEnabled = coaching.ChatEnabled; 
            CustomWebinarUrl = coaching.CustomWebinarUrl;   
            RegistrationEmailNotification = coaching.RegistrationEmailNotification;
            TwentyFourHourReminderNotification = coaching.TwentyFourHourReminderNotification;
            OneHourReminderNotification = coaching.OneHourReminderNotification;
            FifteenMinuteReminderNotification = coaching.FifteenMinuteReminderNotification;
            ReplayFollowUpNotification = coaching.ReplayFollowUpNotification;
            Visible = coaching.Visible;
            Opened = coaching.Opened;
            CohostsEnableMicrophone = coaching.CohostsEnableMicrophone;
            CohostsEnableWebCam = coaching.CohostsEnableWebCam;
            CohostsEnablePresentationTools = coaching.CohostsEnablePresentationTools;
            CohostsEnableSpeakRequests = coaching.CohostsEnableSpeakRequests;
            CohostsViewRegistrants = coaching.CohostsViewRegistrants;
            CohostsManageGuests = coaching.CohostsManageGuests;
            CohostsManageGuestSettings = coaching.CohostsManageGuestSettings;
            CohostsManageAudience = coaching.CohostsManageAudience; 
            CohostsManageAudienceSettings = coaching.CohostsManageAudienceSettings;
            CohostsChatPublicly = coaching.CohostsChatPublicly;
            CohostsChatPubliclyTagMembers = coaching.CohostsChatPubliclyTagMembers;
            CohostsChatPrivately = coaching.CohostsChatPrivately;
            CohostsChatPrivatelySelected = coaching.CohostsChatPrivatelySelected;
            CohostsAllowCohostsToUpvote = coaching.CohostsAllowCohostsToUpvote;
            CohostsAllowCohostsToRespond =  coaching.CohostsAllowCohostsToRespond;
            CohostsCreatePolls = coaching.CohostsCreatePolls;
            CohostsCreateOffers = coaching.CohostsCreateOffers;
            CohostsUploadHandouts = coaching.CohostsUploadHandouts;
            GuestsEnableMicrophone = coaching.GuestsEnableMicrophone;
            GuestsEnableWebCam = coaching.GuestsEnableWebCam;
            GuestsEnablePresentationTools = coaching.GuestsEnablePresentationTools;
            GuestsEnableSpeakRequests = coaching.GuestsEnableSpeakRequests;
            GuestsViewRegistrants = coaching.GuestsViewRegistrants;
            GuestsManageAudience = coaching.GuestsManageAudience;
            GuestsManageAudienceSettings = coaching.GuestsManageAudienceSettings;
            GuestsChatPublicly = coaching.GuestsChatPublicly;
            GuestsChatPubliclyTagMembers = coaching.GuestsChatPubliclyTagMembers;
            GuestsChatPrivately = coaching.GuestsChatPrivately;
            GuestsChatPrivatelySelected = coaching.GuestsChatPrivatelySelected;
            GuestsAllowGuestsToUpvote = coaching.GuestsAllowGuestsToUpvote;
            GuestsAllowGuestsToRespond = coaching.GuestsAllowGuestsToRespond;
            GuestsCreatePolls = coaching.GuestsCreatePolls;
            GuestsCreateOffers = coaching.GuestsCreateOffers;
            GuestsCreateHandouts = coaching.GuestsCreateHandouts;
            AudienceEnableMicrophone = coaching.AudienceEnableMicrophone;
            AudienceEnableWebCam = coaching.AudienceEnableWebCam;
            AudienceEnablePresentationTools = coaching.AudienceEnablePresentationTools;
            AudienceEnableSpeakRequests = coaching.AudienceEnableSpeakRequests;
            AudienceViewAudience = coaching.AudienceViewAudience;
            AudienceChatPublicly = coaching.AudienceChatPublicly;
            AudienceChatPubliclyTagMembers = coaching.AudienceChatPubliclyTagMembers;
            AudienceChatPrivately = coaching.AudienceChatPrivately;
            AudienceChatPrivatelySelected = coaching.AudienceChatPrivatelySelected;
            AudienceAskQuestions = coaching.AudienceAskQuestions;
            AudienceAskPublicQuestions = coaching.AudienceAskPublicQuestions;
            AudienceAskPublicQuestionsAllowAudienceToUpvote = coaching.AudienceAskPublicQuestionsAllowAudienceToUpvote;
            AudienceAskPublicQuestionsAllowAudienceToRespond = coaching.AudienceAskPublicQuestionsAllowAudienceToRespond;
            AudienceAskPrivateQuestionsWithAdmins = coaching.AudienceAskPrivateQuestionsWithAdmins;
            AudienceAskPrivateQuestionsAllowFollowUpResponse = coaching.AudienceAskPrivateQuestionsAllowFollowUpResponse;
            AudienceEnablePollsTab = coaching.AudienceEnablePollsTab;
            AudienceEnableOffersTab = coaching.AudienceEnableOffersTab;
            AudienceEnableOffersTabDisplayNoOfPurchases = coaching.AudienceEnableOffersTabDisplayNoOfPurchases;
            AudienceEnableHandoutsTab = coaching.AudienceEnableHandoutsTab;
            Parent = coaching.Parent;
            ThumbnailDocument = coaching.ThumbnailDocument;
            Language = coaching.Language;
            CreatorUser = coaching.CreatorUser;
            Children = coaching.Children;
            CreationTime = coaching.CreationTime;
            CreatorUserId = coaching.CreatorUserId;
            PopularityWeight = popularityPoints;
        }

        public int PopularityWeight { get; set; }
    }
}
