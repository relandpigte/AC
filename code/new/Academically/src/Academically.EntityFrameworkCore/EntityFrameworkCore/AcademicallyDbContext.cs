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
        public virtual DbSet<UserEducationLevel> UserEducationLevels { get; set; }
        public virtual DbSet<PhoneVerification> PhoneVerifications { get; set; }
        public virtual DbSet<StudentRating> StudentRatings { get; set; }
        public virtual DbSet<TutorRating> TutorRatings { get; set; }
        public virtual DbSet<TutorRatingArea> TutorRatingAreas { get; set; }
        public virtual DbSet<Document> Documents { get; set; }
        public virtual DbSet<UserQualification> UserQualifications { get; set; }
        public virtual DbSet<UserQualificationDocument> UserQualificationDocuments { get; set; }
        public virtual DbSet<PassportVerification> PassportVerifications { get; set; }
        public virtual DbSet<UserEducationDocument> UserEducationDocuments { get; set; }

        public AcademicallyDbContext(DbContextOptions<AcademicallyDbContext> options)
            : base(options)
        {
        }
    }
}
