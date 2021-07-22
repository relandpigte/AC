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
