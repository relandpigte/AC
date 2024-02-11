using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities;

[Table("ServiceFeatureFlags")]
public class ServiceFeatureFlag : CreationAuditedEntity<Guid>
{
    public Guid ReferenceId { get; set; }
    public ServicesType ServiceType { get; set; }
    
    public bool Attendees { get; set; }
    public bool AttendeesCanViewAudience { get; set; }
    public bool AttendeesCanAdmitAudience { get; set; }
    public bool AttendeesCanKickAudience { get; set; }
    public bool AttendeesPromoteAudience { get; set; }
    
    public bool Chat { get; set; }
    public bool ChatAudiencePublic { get; set; }
    public bool ChatAudiencePrivate { get; set; }
    
    public bool Activities { get; set; }
    public bool ActivitiesAudienceCanAdd { get; set; }
    public bool ActivitiesAudienceCanParticipate { get; set; }
    public bool ActivitiesAudienceCanViewResult { get; set; }
    
    public bool Questions { get; set; }
    public bool QuestionsAudienceCanVote { get; set; }
    public bool QuestionsAudienceCanAsk { get; set; }
    public bool QuestionsAudienceCanRespond { get; set; }
    public bool QuestionsAudienceCanAnswerLive { get; set; }
    
    public bool Offers { get; set; }
    public bool OffersAudienceCanCreate { get; set; }
    public bool OffersAudienceCanPurchase { get; set; }
    
    public bool Handouts { get; set; }
    public bool HandoutsAudienceCanAdd { get; set; }
    public bool HandoutsAudienceCanShare { get; set; }
    public bool HandoutsAudienceCanDownload { get; set; }
    
    public bool Comments { get; set; }
    public bool CommentsAudienceCanAdd { get; set; }
    public bool CommentsAudienceCanReact { get; set; }
    public CommentSetting CommentSetting { get; set; }
    
    public bool Reviews { get; set; }
    public bool Settings { get; set; }
    
    public bool InteractiveToolsAudienceMicrophone { get; set; }
    public bool InteractiveToolsAudienceWebCam { get; set; }
    public bool InteractiveToolsAudienceSharing { get; set; }
    public bool InteractiveToolsAudienceRaiseHand { get; set; }
    public bool InteractiveToolsAudienceLowerHand { get; set; }
    
    public bool RecordingAllowAudience { get; set; }
    
    public bool CourseLockLessonOrder { get; set; }
    public bool CourseMandatoryActivity { get; set; }

    [ForeignKey("CreatorUserId")]
    public User CreatorUser { get; set; }
}