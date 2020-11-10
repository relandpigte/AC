using System;
using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Dependency;

namespace Academically.Events
{
    public abstract class BackgroundJobEventHandler : ITransientDependency
    {
        private readonly IBackgroundJobManager _backgroundJobManager;

        public BackgroundJobEventHandler(IBackgroundJobManager backgroundJobManager)
        {
            _backgroundJobManager = backgroundJobManager;
        }

        protected async Task EnqueueAsync<TJob, TJobArgs>(TJobArgs args) where TJob : IBackgroundJob<TJobArgs>
        {
            var delay = new TimeSpan(0, 0, 10);
            await _backgroundJobManager.EnqueueAsync<TJob, TJobArgs>(args, BackgroundJobPriority.High, delay);
        }
    }
}
