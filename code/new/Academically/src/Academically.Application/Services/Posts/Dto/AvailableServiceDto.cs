using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;
using Academically.Services.SpokenLanugages.Dto;
using Academically.Services.StudentCourses.Dto;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Posts.Dto
{
    [AutoMap(typeof(Article), typeof(Event), typeof(Course), typeof(Video), typeof(Coaching))]
    public class AvailableServiceDto : FullAuditedEntityDto<Guid>
    {
        #region Event
        public int Type { get; set; }
        public int Status { get; set; }
        public int? ReplayType { get; set; }
        public int? FrequencyType { get; set; }
        public DateTime? EventDateTime { get; set; }
        public int Duration { get; set; }
        public int RecursionType { get; set; }
        public int? TimesPerDay { get; set; }
        public string SessionTimes { get; set; }
        public string SessionDaysOfWeek { get; set; }
        public string SessionDaysOfMonth { get; set; }
        public bool AutoAdmitAttendees { get; set; }
        
        #endregion

        #region Course
        public string Subtitle { get; set; }
        public bool IsOpen { get; set; }
        public Guid? ImageDocumentId { get; set; }
        public Guid? CurrencyId { get; set; }
        public int? NumberOfPlaces { get; set; }
        public DateTime? StartDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public CommentSetting? CommentsVisibility { get; set; }
        public bool? CommentsNeedAdminApproval { get; set; }
        public string CourseImageUrl { get; set; }
        public DocumentDto ImageDocument { get; set; }
        public IEnumerable<StudentCourseDto> StudentCourses { get; set; }
        public int Modules { get; set; }
        public int Lessons { get; set; }
        public decimal Progress { get; set; }
        public int Units { get; set; }
        #endregion

        #region Video
        public Guid? DocumentId { get; set; }
        public bool CommentModeration { get; set; }
        public string CustomUrl { get; set; }
        public string Category { get; set; }
        public int VideoCount { get; set; }
        public int VideoLength { get; set; }
        public float Rating { get; set; }
        public int Reviews { get; set; }
        public DocumentDto Document { get; set; }
        public int LikeCount { get; set; }
        #endregion

        #region Articles
        public int ArticlesCount { get; set; } = 0;
        #endregion
        
        #region Workshop
        public DateTime? WorkshopDateTime { get; set; }
        public int? NumberOfAttendees { get; set; }
       
      
        #endregion

        #region Common Fields
        public ServicesType ServiceType { get; set; }
        public Guid? ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Categories { get; set; }
        public Guid? ThumbnailDocumentId { get; set; }
        public Guid? LanguageId { get; set; }
        public PricingType? PricingType { get; set; }
        public decimal? Price { get; set; }
        public DateTime? EndDate { get; set; }

        public bool IsVisible { get; set; }

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
        public CommentSetting CommentSetting { get; set; }
        public long CreatorUserId { get; set; }
        public string ThumbnailImageUrl { get; set; }

        public DocumentDto ThumbnailDocument { get; set; }
        public SpokenLanguageDto Language { get; set; }
        public UserDto CreatorUser { get; set; }

        public int PopularityWeight { get; set; }

        #endregion
    }
}
