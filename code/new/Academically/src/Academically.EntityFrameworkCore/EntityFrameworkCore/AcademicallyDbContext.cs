using Abp.Zero.EntityFrameworkCore;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace Academically.EntityFrameworkCore
{
    public class AcademicallyDbContext : AbpZeroDbContext<Tenant, Role, User, AcademicallyDbContext>
    {
        public virtual DbSet<Registration> Registrations { get; set; }
        public virtual DbSet<EducationLevel> EducationLevels { get; set; }
        public virtual DbSet<University> Universities { get; set; }
        public virtual DbSet<UserEducation> UserEducations { get; set; }
        public virtual DbSet<PhoneVerification> PhoneVerifications { get; set; }
        public virtual DbSet<StudentRating> StudentRatings { get; set; }
        public virtual DbSet<TutorRating> TutorRatings { get; set; }
        public virtual DbSet<TutorRatingArea> TutorRatingAreas { get; set; }
        public virtual DbSet<Document> Documents { get; set; }
        public virtual DbSet<UserQualification> UserQualifications { get; set; }
        public virtual DbSet<UserQualificationDocument> UserQualificationDocuments { get; set; }
        public virtual DbSet<PassportVerification> PassportVerifications { get; set; }
        public virtual DbSet<UserEducationDocument> UserEducationDocuments { get; set; }
        public virtual DbSet<DisciplineTaxonomy> DisciplineTaxonomies { get; set; }
        public virtual DbSet<UserResearchInterest> UserResearchInterests { get; set; }
        public virtual DbSet<UserResearchInterestDisciplineTaxonomy> UserResearchInterestDisciplineTaxonomies { get; set; }
        public virtual DbSet<ResearchMethod> ResearchMethods { get; set; }
        public virtual DbSet<UserResearchMethodology> UserResearchMethodologies { get; set; }
        public virtual DbSet<UserResearchMethodologyResearchMethod> UserResearchMethodologyResearchMethods { get; set; }
        public virtual DbSet<UserTopic> UserTopics { get; set; }
        public virtual DbSet<PublicationTag> PublicationTags { get; set; }
        public virtual DbSet<UserPublication> UserPublications { get; set; }
        public virtual DbSet<UserPublicationTag> UserPublicationTags { get; set; }
        public virtual DbSet<Service> Services { get; set; }
        public virtual DbSet<ServiceMapping> ServiceMappings { get; set; }
        public virtual DbSet<Subject> Subjects { get; set; }
        public virtual DbSet<ServiceSubject> ServiceSubjects { get; set; }
        public virtual DbSet<UserService> UserServices { get; set; }
        public virtual DbSet<UserServiceSubject> UserServiceSubjects { get; set; }
        public virtual DbSet<UserServiceDisciplineTaxonomy> UserServiceDisciplineTaxonomies { get; set; }
        public virtual DbSet<TimeZone> TimeZones { get; set; }
        public virtual DbSet<SpokenLanguage> SpokenLanguages { get; set; }
        public virtual DbSet<UserSpokenLanguage> UserSpokenLanguages { get; set; }
        public virtual DbSet<PhotoIdVerification> PhotoIdVerifications { get; set; }
        public virtual DbSet<PasswordReset> PasswordResets { get; set; }
        public virtual DbSet<TutorVerification> TutorVerifications { get; set; }
        public virtual DbSet<Reference> References { get; set; }
        public virtual DbSet<DbsCertificate> DbsCertificates { get; set; }
        public virtual DbSet<AcceptanceLog> AcceptanceLogs { get; set; }
        public virtual DbSet<CalendarEvent> CalendarEvents { get; set; }
        public virtual DbSet<Service2> Service2s { get; set; }
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<ProjectOffer> ProjectOffers { get; set; }
        public virtual DbSet<RescheduleComment> RescheduleComments { get; set; }
        public virtual DbSet<TutorVerificationStep> TutorVerificationSteps { get; set; }
        public virtual DbSet<TutorVerificationStepReviewer> TutorVerificationStepReviewers { get; set; }
        public virtual DbSet<AcademicLevel> AcademicLevels { get; set; }
        public virtual DbSet<AcademicLevelQualification> AcademicLevelQualifications { get; set; }
        public virtual DbSet<UserEducationCourse> UserEducationCourses { get; set; }
        public virtual DbSet<UserCalendarEvent> UserCalendarEvents { get; set; }
        public virtual DbSet<Session> Sessions { get; set; }
        public virtual DbSet<SessionCandidate> SessionCandidates { get; set; }
        public virtual DbSet<UserAvailability> UserAvailabilities { get; set; }
        public virtual DbSet<ConversationGroup> ConversationGroups { get; set; }
        public virtual DbSet<Conversation> Conversations { get; set; }
        public virtual DbSet<ConversationDocument> ConversationDocuments { get; set; }
        public virtual DbSet<Currency> Currencies { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<CourseSection> CourseSections { get; set; }
        public virtual DbSet<CourseSectionPage> CourseSectionPages { get; set; }
        public virtual DbSet<AuditLogs> AuditLogs { get; set; }
        public virtual DbSet<ProjectInvitation> ProjectInvitations { get; set; }
        public virtual DbSet<StudentCourse> StudentCourses { get; set; }
        public virtual DbSet<StudentCourseSection> StudentCourseSections { get; set; }
        public virtual DbSet<CourseRating> CourseRatings { get; set; }
        public virtual DbSet<CourseRatingArea> CourseRatingAreas { get; set; }
        public virtual DbSet<CourseConversation> CourseConversations { get; set; }
        public virtual DbSet<CourseConversationReaction> CourseConversationReactions { get; set; }
        public virtual DbSet<CourseAssignment> CourseAssignments { get; set; }
        public virtual DbSet<Video> Videos { get; set; }
        public virtual DbSet<VideoTopic> VideoTopics { get; set; }
        public virtual DbSet<VideoAttachment> VideoAttachments { get; set; }
        public virtual DbSet<Article> Articles { get; set; }
        public virtual DbSet<ArticleTopic> ArticleTopics { get; set; }
        public virtual DbSet<Content> Contents { get; set; }
        public virtual DbSet<ContentMargin> ContentMargins { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<CommentReaction> CommentReactions { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<StudentVideo> StudentVideos { get; set; }
        public virtual DbSet<Reaction> Reactions { get; set; }
        public virtual DbSet<UserFollower> UserFollowers { get; set; }
        public virtual DbSet<StudentArticle> StudentArticles { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<EventResource> EventResources { get; set; }
        public virtual DbSet<EventPoll> EventPolls { get; set; }
        public virtual DbSet<EventPollQuestion> EventPollQuestions { get; set; }
        public virtual DbSet<EventPollQuestionOption> EventPollQuestionOptions { get; set; }
        public virtual DbSet<EventPollAnswer> EventPollAnswers { get; set; }
        public virtual DbSet<QuestionReaction> QuestionReactions { get; set; }
        public virtual DbSet<Forum> Forums { get; set; }
        public virtual DbSet<ForumReply> ForumReplies { get; set; }
        public virtual DbSet<Topic> Topics { get; set; }
        public virtual DbSet<ForumTopic> ForumTopics { get; set; }
        public virtual DbSet<StudentEvent> StudentEvents { get; set; }
        public virtual DbSet<EventPresenter> EventPresenters { get; set; }
        public virtual DbSet<ConferenceSession> ConferenceSessions { get; set; }
        public virtual DbSet<ConferenceSessionCandidate> ConferenceSessionCandidates { get; set; }
        public virtual DbSet<ProjectDocument> ProjectDocuments { get; set; }
        public virtual DbSet<ProjectAvailability> ProjectAvailabilities { get; set; }
        public virtual DbSet<WorkHistory> WorkHistories { get; set; }
        public virtual DbSet<Coaching> Coachings { get; set; }
        public virtual DbSet<CoachingPresenter> CoachingPresenters { get; set; }
        public virtual DbSet<CoachingResource> CoachingResources { get; set; }
        public virtual DbSet<CoachingPoll> CoachingPolls { get; set; }
        public virtual DbSet<CoachingPollQuestion> CoachingPollQuestions { get; set; }
        public virtual DbSet<CoachingPollQuestionOption> CoachingPollQuestionOptions { get; set; }
        public virtual DbSet<CoachingTopic> CoachingTopics { get; set; }
        public virtual DbSet<EventOffer> EventOffer { get; set; }
        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<PostTopic> PostTopics { get; set; }
        public virtual DbSet<CourseTopic> CourseTopics { get; set; }
        public virtual DbSet<EventTopic> EventTopics { get; set; }
        public virtual DbSet<PostAttachment> PostAttachments { get; set; }
        public virtual DbSet<PostVisibility> PostVisibility { get; set; }
        public virtual DbSet<PostInvitation> PostInvitations { get; set; }
        public virtual DbSet<PostNotification> PostNotification { get; set; }
        public virtual DbSet<SavedService> SavedService { get; set; }
        public virtual DbSet<Channel> Channels { get; set; }
        public virtual DbSet<ChannelMessage> ChannelMessages { get; set; }
        public virtual DbSet<ChannelMember> ChannelMembers { get; set; }
        public virtual DbSet<ChannelArchive> ChannelArchives { get; set; }
        public virtual DbSet<ChannelNotification> ChannelNotifications { get; set; }
        public virtual DbSet<ChannelMessageAttachment> ChannelMessageAttachments { get; set; }
        public virtual DbSet<UserBlocking> UserBlockings { get; set; }
        public virtual DbSet<UserStatusLog> UserStatusLogs { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationUser> NotificationUsers { get; set; }
        public virtual DbSet<NotificationSource> NotificationSources { get; set; }
        public virtual DbSet<ServiceDiscussion> ServiceDiscussion { get; set; }
        public virtual DbSet<ServiceRating> ServiceRatings { get; set; }
        public virtual DbSet<ServiceRatingArea> ServiceRatingAreas { get; set; }
        public virtual DbSet<ServiceOffer> ServiceOffers { get; set; }
        public virtual DbSet<ServicePurchase> ServicePurchases { get; set; }
        public virtual DbSet<EventRating> EventRatings { get; set; }
        public virtual DbSet<ChannelMessageVisibility> ChannelMessageVisibility { get; set; }
        public virtual DbSet<UserAvailabilitySetting> UserAvailabilitySettings { get; set; }
        public virtual DbSet<ServiceBooking> ServiceBookings { get; set; }
        public virtual DbSet<ServiceReview> ServiceReviews { get; set; }
        public virtual DbSet<ServicePoll> ServicePolls { get; set; }
        public virtual DbSet<ServicePollQuestion> ServicePollQuestions { get; set; }
        public virtual DbSet<ServicePollQuestionOption> ServicePollQuestionOptions { get; set; }
        public virtual DbSet<ServiceQuiz> ServiceQuizes { get; set; }
        public virtual DbSet<ServiceQuizQuestion> ServiceQuizQuestions { get; set; }
        public virtual DbSet<ServiceQuizQuestionOption> ServiceQuizQuestionOptions { get; set; }
        public virtual DbSet<ServiceFeatureFlag> ServiceFeatureFlags { get; set; }
        public virtual DbSet<ServiceActivity> ServiceActivities { get; set; }
        public virtual DbSet<ServicePresentation> ServicePresentations { get; set; }
        public AcademicallyDbContext(DbContextOptions<AcademicallyDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ServiceSubject>().HasKey(t => new { t.ServiceId, t.SubjectId });
            base.OnModelCreating(modelBuilder);
        }
    }
}
