using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.MultiTenancy;
using Academically.Domain.Entities;

namespace Academically.EntityFrameworkCore
{
    public class AcademicallyDbContext : AbpZeroDbContext<Tenant, Role, User, AcademicallyDbContext>
    {
        public virtual DbSet<Registration> Registrations { get; set; }
        public virtual DbSet<EducationLevel> EducationLevels { get; set; }
        public virtual DbSet<University> Universities { get; set; }
        public virtual DbSet<UserEducation> UserEducations { get; set; }
        public virtual DbSet<UserEducationLevel> UserEducationLevels { get; set; }

        public AcademicallyDbContext(DbContextOptions<AcademicallyDbContext> options)
            : base(options)
        {
        }
    }
}
