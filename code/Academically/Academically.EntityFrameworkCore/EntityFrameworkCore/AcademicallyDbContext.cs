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
        public virtual DbSet<Registration> Registrations { get; set; }
        public virtual DbSet<UserProfile> UserProfiles { get; set; }

        public AcademicallyDbContext(DbContextOptions<AcademicallyDbContext> options)
            : base(options)
        {
        }
    }
}
