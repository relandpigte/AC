using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.MultiTenancy;

namespace Academically.EntityFrameworkCore
{
    public class AcademicallyDbContext : AbpZeroDbContext<Tenant, Role, User, AcademicallyDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public AcademicallyDbContext(DbContextOptions<AcademicallyDbContext> options)
            : base(options)
        {
        }
    }
}
