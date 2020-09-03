using Abp.BackgroundJobs;
using Abp.Dependency;

namespace Academically
{
    public abstract class AcademicallyBackgroundJobBase<TJobArgs> : BackgroundJob<TJobArgs>, ITransientDependency
    {
        public AcademicallyBackgroundJobBase()
        {
            LocalizationSourceName = AcademicallyConsts.LocalizationSourceName;
        }
    }
}
