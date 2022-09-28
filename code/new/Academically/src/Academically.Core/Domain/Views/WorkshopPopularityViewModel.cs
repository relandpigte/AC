using Academically.Domain.Entities;
using Academically.Domain.Interfaces;

namespace Academically.Domain.Views
{
    public class WorkshopPopularityViewModel : Workshop, IHasPopularityWeight
    {
        public WorkshopPopularityViewModel() 
        {

        }

        public WorkshopPopularityViewModel(Workshop workshop, int popularityPoints)
        {
            Id = workshop.Id;
            Type = workshop.Type;
            Status = workshop.Status;
            ParentId = workshop.ParentId;
            Name = workshop.Name;
            Description = workshop.Description;
            Categories = workshop.Categories;
            ThumbnailDocumentId = workshop.ThumbnailDocumentId;
            LanguageId = workshop.LanguageId;
            PricingType = workshop.PricingType;
            Price = workshop.Price;
            FrequencyType = workshop.FrequencyType;
            WorkshopDateTime = workshop.WorkshopDateTime;
            EndDate = workshop.EndDate;
            Duration = workshop.Duration;
            DelayType = workshop.DelayType;
            DelayValue = workshop.DelayValue;
            RecursionType = workshop.RecursionType;
            TimesPerDay = workshop.TimesPerDay;
            SessionTimes = workshop.SessionTimes;
            SessionDaysOfWeek = workshop.SessionDaysOfWeek;
            SessionDaysOfMonth = workshop.SessionDaysOfMonth;
            NumberOfAttendees = workshop.NumberOfAttendees;
            ReplayType = workshop.ReplayType;
            QuestionsEnabled = workshop.QuestionsEnabled;
            QuestionType = workshop.QuestionType;
            AttendeesCanUpvote = workshop.AttendeesCanUpvote;
            AttendeesCanRespond = workshop.AttendeesCanRespond;
            ChatEnabled = workshop.ChatEnabled;
            CustomWebinarUrl = workshop.CustomWebinarUrl;
            RegistrationEmailNotification = workshop.RegistrationEmailNotification;
            TwentyFourHourReminderNotification = workshop.TwentyFourHourReminderNotification;
            OneHourReminderNotification = workshop.OneHourReminderNotification;
            FifteenMinuteReminderNotification = workshop.FifteenMinuteReminderNotification;
            ReplayFollowUpNotification = workshop.ReplayFollowUpNotification;
            Visible = workshop.Visible;
            Opened = workshop.Opened;
            CohostsEnableMicrophone = workshop.CohostsEnableMicrophone;
            CohostsEnableWebCam = workshop.CohostsEnableWebCam;
            CohostsEnablePresentationTools = workshop.CohostsEnablePresentationTools;
            CohostsEnableSpeakRequests = workshop.CohostsEnableSpeakRequests;
            CohostsViewRegistrants = workshop.CohostsViewRegistrants;
            CohostsManageGuests = workshop.CohostsManageGuests;
            CohostsManageGuestSettings = workshop.CohostsManageGuestSettings;
            CohostsManageAudience = workshop.CohostsManageAudience;
            CohostsManageAudienceSettings = workshop.CohostsManageAudienceSettings;
            CohostsChatPublicly = workshop.CohostsChatPublicly;
            CohostsChatPubliclyTagMembers = workshop.CohostsChatPubliclyTagMembers;
            CohostsChatPrivately = workshop.CohostsChatPrivately;
            CohostsChatPrivatelySelected = workshop.CohostsChatPrivatelySelected;
            CohostsAllowCohostsToUpvote = workshop.CohostsAllowCohostsToUpvote;
            CohostsAllowCohostsToRespond = workshop.CohostsAllowCohostsToRespond;
            CohostsCreatePolls = workshop.CohostsCreatePolls;
            CohostsCreateOffers = workshop.CohostsCreateOffers;
            CohostsUploadHandouts = workshop.CohostsUploadHandouts;
            GuestsEnableMicrophone = workshop.GuestsEnableMicrophone;
            GuestsEnableWebCam = workshop.GuestsEnableWebCam;
            GuestsEnablePresentationTools = workshop.GuestsEnablePresentationTools;
            GuestsEnableSpeakRequests = workshop.GuestsEnableSpeakRequests;
            GuestsViewRegistrants = workshop.GuestsViewRegistrants;
            GuestsManageAudience = workshop.GuestsManageAudience;
            GuestsManageAudienceSettings = workshop.GuestsManageAudienceSettings;
            GuestsChatPublicly = workshop.GuestsChatPublicly;
            GuestsChatPubliclyTagMembers = workshop.GuestsChatPubliclyTagMembers;
            GuestsChatPrivately = workshop.GuestsChatPrivately;
            GuestsChatPrivatelySelected = workshop.GuestsChatPrivatelySelected;
            GuestsAllowGuestsToUpvote = workshop.GuestsAllowGuestsToUpvote;
            GuestsAllowGuestsToRespond = workshop.GuestsAllowGuestsToRespond;
            GuestsCreatePolls = workshop.GuestsCreatePolls;
            GuestsCreateOffers = workshop.GuestsCreateOffers;
            GuestsCreateHandouts = workshop.GuestsCreateHandouts;
            AudienceEnableMicrophone = workshop.AudienceEnableMicrophone;
            AudienceEnableWebCam = workshop.AudienceEnableWebCam;
            AudienceEnablePresentationTools = workshop.AudienceEnablePresentationTools;
            AudienceEnableSpeakRequests = workshop.AudienceEnableSpeakRequests;
            AudienceViewAudience = workshop.AudienceViewAudience;
            AudienceChatPublicly = workshop.AudienceChatPublicly;
            AudienceChatPubliclyTagMembers = workshop.AudienceChatPubliclyTagMembers;
            AudienceChatPrivately = workshop.AudienceChatPrivately;
            AudienceChatPrivatelySelected = workshop.AudienceChatPrivatelySelected;
            AudienceAskQuestions = workshop.AudienceAskQuestions;
            AudienceAskPublicQuestions = workshop.AudienceAskPublicQuestions;
            AudienceAskPublicQuestionsAllowAudienceToUpvote = workshop.AudienceAskPublicQuestionsAllowAudienceToUpvote;
            AudienceAskPublicQuestionsAllowAudienceToRespond = workshop.AudienceAskPublicQuestionsAllowAudienceToRespond;
            AudienceAskPrivateQuestionsWithAdmins = workshop.AudienceAskPrivateQuestionsWithAdmins;
            AudienceAskPrivateQuestionsAllowFollowUpResponse = workshop.AudienceAskPrivateQuestionsAllowFollowUpResponse;
            AudienceEnablePollsTab = workshop.AudienceEnablePollsTab;
            AudienceEnableOffersTab = workshop.AudienceEnableOffersTab;
            AudienceEnableOffersTabDisplayNoOfPurchases = workshop.AudienceEnableOffersTabDisplayNoOfPurchases;
            AudienceEnableHandoutsTab = workshop.AudienceEnableHandoutsTab;
            Parent = workshop.Parent;
            ThumbnailDocument = workshop.ThumbnailDocument;
            Language = workshop.Language;
            CreatorUser =   workshop.CreatorUser;
            Children = workshop.Children;
            CreationTime = workshop.CreationTime;
            CreatorUserId = workshop.CreatorUserId;
            PopularityWeight = popularityPoints;
        }

        public int PopularityWeight { get; set; }
    }
}
