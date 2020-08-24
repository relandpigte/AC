using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Academically.EntityFrameworkCore
{
    public static class AcademicallyDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AcademicallyDbContext> builder, string connectionString)
        {
            builder.UseMySql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<AcademicallyDbContext> builder, DbConnection connection)
        {
            builder.UseMySql(connection);
        }
    }
}
