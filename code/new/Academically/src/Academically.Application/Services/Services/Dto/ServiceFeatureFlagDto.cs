using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Services.Dto;

[AutoMap(typeof(ServiceFeatureFlag))]
public class ServiceFeatureFlagDto : CreationAuditedEntityDto<Guid>
{
    public Guid ReferenceId { get; set; }
    public ServicesType ServiceType { get; set; }
    
    public bool Attendees { get; set; }
    
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
    
    public bool Reviews { get; set; }
    public bool Settings { get; set; }
    
    public bool InteractiveToolsAudienceMicrophone { get; set; }
    public bool InteractiveToolsAudienceWebCam { get; set; }
    public bool InteractiveToolsAudienceSharing { get; set; }
    public bool InteractiveToolsAudienceRaiseHand { get; set; }
    public bool InteractiveToolsAudienceLowerHand { get; set; }
    
}