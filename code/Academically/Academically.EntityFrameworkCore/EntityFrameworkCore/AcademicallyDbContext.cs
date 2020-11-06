using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.MultiTenancy;
using Academically.Entities;

namespace Academically.EntityFrameworkCore
{
    public class AcademicallyDbContext : AbpZeroDbContext<Tenant, Role, User, AcademicallyDbContext>
    {
        public virtual DbSet<ResearchMethodRequest> ResearchMethodRequests { get; set; }
        public virtual DbSet<UserSupportService> UserSupportServices { get; set; }
        public virtual DbSet<SupportService> SupportServices { get; set; }
        public virtual DbSet<UserResearchMethod> UserResearchMethods { get; set; }
        public virtual DbSet<ResearchMethod> ResearchMethods { get; set; }
        public virtual DbSet<Registration> Registrations { get; set; }
        public virtual DbSet<UserProfile> UserProfiles { get; set; }
        public virtual DbSet<UserEducation> UserEducations { get; set; }
        public virtual DbSet<UserPublication> UserPublications { get; set; }
        public virtual DbSet<DisciplineTaxonomy> DisciplineTaxonomies { get; set; }
        public virtual DbSet<UserDisciplineTaxonomy> UserDisciplineTaxonomies { get; set; }
        public virtual DbSet<UserTutorial> UserTutorials { get; set; }
        public virtual DbSet<UserTutorialDisciplineTaxonomy> UserTutorialDisciplineTaxonomies { get; set; }
        public virtual DbSet<UrgencyLevel> UrgencyLevels { get; set; }
        public virtual DbSet<DisciplineTaxonomyStudylevel> DisciplineTaxonomyStudylevels { get; set; }
        public virtual DbSet<UserDisciplineTaxonomyStudyLevel> UserDisciplineTaxonomyStudyLevels { get; set; }

        public AcademicallyDbContext(DbContextOptions<AcademicallyDbContext> options)
            : base(options)
        {
        }
    }
}
