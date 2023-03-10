using Academically.Domain.Entities;
using Academically.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Domain.Views
{
    public class EventPopularityViewModel : Event, IHasPopularityWeight
    {
        public int PopularityWeight { get; set; }

        public EventPopularityViewModel(Event _event, int popularityPoints)
        {
            Id = _event.Id;
            Category = _event.Category;
            Type = _event.Type;
            Status = _event.Status;
            ParentId = _event.ParentId;
            Name = _event.Name;
            Description = _event.Description;
            Categories = _event.Categories;
            ThumbnailDocumentId = _event.ThumbnailDocumentId;
            LanguageId = _event.LanguageId;
            PricingType = _event.PricingType;
            Price = _event.Price;
            FrequencyType = _event.FrequencyType;
            EventDateTime = _event.EventDateTime;
            EndDate = _event.EndDate;
            Duration = _event.Duration;
            ReplayType = _event.ReplayType;
            QuestionsEnabled = _event.QuestionsEnabled;
            QuestionType = _event.QuestionType;
            AttendeesCanUpvote = _event.AttendeesCanUpvote;
            AttendeesCanRespond = _event.AttendeesCanRespond;
            ChatEnabled = _event.ChatEnabled;
            CustomWebinarUrl = _event.CustomWebinarUrl;
            RegistrationEmailNotification = _event.RegistrationEmailNotification;
            TwentyFourHourReminderNotification = _event.TwentyFourHourReminderNotification;
            OneHourReminderNotification = _event.OneHourReminderNotification;
            FifteenMinuteReminderNotification = _event.FifteenMinuteReminderNotification;
            ReplayFollowUpNotification = _event.ReplayFollowUpNotification;
            Visible = _event.Visible;
            Opened = _event.Opened;
            DelayType = _event.DelayType;
            DelayValue = _event.DelayValue;
            RecursionType = _event.RecursionType;
            TimesPerDay = _event.TimesPerDay;
            SessionTimes = _event.SessionTimes;
            SessionDaysOfWeek = _event.SessionDaysOfWeek;
            SessionDaysOfMonth = _event.SessionDaysOfMonth;
            CohostsEnableMicrophone = _event.CohostsEnableMicrophone;
            CohostsEnableWebCam = _event.CohostsEnableWebCam;
            CohostsEnablePresentationTools = _event.CohostsEnablePresentationTools;
            CohostsEnableSpeakRequests = _event.CohostsEnableSpeakRequests;
            CohostsViewRegistrants = _event.CohostsViewRegistrants;
            CohostsManageGuests = _event.CohostsManageGuests;
            CohostsManageGuestSettings = _event.CohostsManageGuestSettings;
            CohostsManageAudience = _event.CohostsManageAudience;
            CohostsManageAudienceSettings = _event.CohostsManageAudienceSettings;
            CohostsChatPublicly = _event.CohostsChatPublicly;
            CohostsChatPubliclyTagMembers = _event.CohostsChatPubliclyTagMembers;
            CohostsChatPrivately = _event.CohostsChatPrivately;
            CohostsChatPrivatelySelected = _event.CohostsChatPrivatelySelected;
            CohostsAllowCohostsToUpvote = _event.CohostsAllowCohostsToUpvote;
            CohostsAllowCohostsToRespond = _event.CohostsAllowCohostsToRespond;
            CohostsCreatePolls = _event.CohostsCreatePolls;
            CohostsCreateOffers = _event.CohostsCreateOffers;
            CohostsUploadHandouts = _event.CohostsUploadHandouts;
            GuestsEnableMicrophone = _event.GuestsEnableMicrophone;
            GuestsEnableWebCam = _event.GuestsEnableWebCam;
            GuestsEnablePresentationTools = _event.GuestsEnablePresentationTools;
            GuestsEnableSpeakRequests = _event.GuestsEnableSpeakRequests;
            GuestsViewRegistrants = _event.GuestsViewRegistrants;
            GuestsManageAudience = _event.GuestsManageAudience;
            GuestsManageAudienceSettings = _event.GuestsManageAudienceSettings;
            GuestsChatPublicly = _event.GuestsChatPublicly;
            GuestsChatPubliclyTagMembers = _event.GuestsChatPubliclyTagMembers;
            GuestsChatPrivately = _event.GuestsChatPrivately;
            GuestsChatPrivatelySelected = _event.GuestsChatPrivatelySelected;
            GuestsAllowGuestsToUpvote = _event.GuestsAllowGuestsToUpvote;
            GuestsAllowGuestsToRespond = _event.GuestsAllowGuestsToRespond;
            GuestsCreatePolls = _event.GuestsCreatePolls;
            GuestsCreateOffers = _event.GuestsCreateOffers;
            GuestsCreateHandouts = _event.GuestsCreateHandouts;
            AudienceEnableMicrophone = _event.AudienceEnableMicrophone;
            AudienceEnableWebCam = _event.AudienceEnableWebCam;
            AudienceEnablePresentationTools = _event.AudienceEnablePresentationTools;
            AudienceEnableSpeakRequests = _event.AudienceEnableSpeakRequests;
            AudienceViewAudience = _event.AudienceViewAudience;
            AudienceChatPublicly = _event.AudienceChatPublicly;
            AudienceChatPubliclyTagMembers = (_event.AudienceChatPubliclyTagMembers);
            AudienceChatPrivately = (_event.AudienceChatPrivately);
            AudienceChatPrivatelySelected = (_event.AudienceChatPrivatelySelected);
            AudienceAskQuestions = _event.AudienceAskQuestions;
            AudienceAskPublicQuestions = _event.AudienceAskPublicQuestions;
            AudienceAskPublicQuestionsAllowAudienceToUpvote = _event.AudienceAskPublicQuestionsAllowAudienceToUpvote;
            AudienceAskPublicQuestionsAllowAudienceToRespond = _event.AudienceAskPublicQuestionsAllowAudienceToRespond;
            AudienceAskPrivateQuestionsWithAdmins = _event.AudienceAskPrivateQuestionsWithAdmins;
            AudienceAskPrivateQuestionsAllowFollowUpResponse = _event.AudienceAskPrivateQuestionsAllowFollowUpResponse;
            AudienceEnablePollsTab = _event.AudienceEnablePollsTab;
            AudienceEnableOffersTab = _event.AudienceEnableOffersTab;
            AudienceEnableOffersTabDisplayNoOfPurchases = _event.AudienceEnableOffersTabDisplayNoOfPurchases;
            AudienceEnableHandoutsTab = _event.AudienceEnableHandoutsTab;
            AutoAdmitAttendees = _event.AutoAdmitAttendees;
            NumberOfAttendees = _event.NumberOfAttendees;
            Parent = _event.Parent;
            ThumbnailDocument = _event.ThumbnailDocument;
            Language = _event.Language;
            CreatorUser = _event.CreatorUser;
            Children = _event.Children;
            StudentEvents = _event.StudentEvents;
            EventPresenters = _event.EventPresenters;
            CreationTime = _event.CreationTime;
            CreatorUserId = _event.CreatorUserId;           
            PopularityWeight = popularityPoints;
        }
    }
}
