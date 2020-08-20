using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Academically.Configuration;
using Academically.Web;

namespace Academically.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class AcademicallyDbContextFactory : IDesignTimeDbContextFactory<AcademicallyDbContext>
    {
        public AcademicallyDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AcademicallyDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            AcademicallyDbContextConfigurer.Configure(builder, configuration.GetConnectionString(AcademicallyConsts.ConnectionStringName));

            return new AcademicallyDbContext(builder.Options);
        }
    }
}
