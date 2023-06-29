using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace Academically.EntityFrameworkCore
{
    public static class AcademicallyDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<AcademicallyDbContext> builder, string connectionString)
        {
            builder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }

        public static void Configure(DbContextOptionsBuilder<AcademicallyDbContext> builder, DbConnection connection)
        {
            builder.UseMySql(connection, ServerVersion.AutoDetect(connection as MySqlConnection));
        }
    }
}
