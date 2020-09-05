using Abp.Domain.Repositories;
using Academically.Authorization.Users;
using Academically.BackgroundJobs.JobArgs;

namespace Academically.BackgroundJobs
{
    public class SaveUserLastLoginTimeJob : AcademicallyBackgroundJobBase<SaveUserLastLoginTimeJobArgs>
    {
        private readonly IRepository<User, long> _usersRepository;

        public SaveUserLastLoginTimeJob(IRepository<User, long> usersRepository)
        {
            _usersRepository = usersRepository;
        }

        public override void Execute(SaveUserLastLoginTimeJobArgs args)
        {
            var user = _usersRepository.Get(args.UserId);
            user.LastLoginTime = args.LastLoginTime;
            _usersRepository.Update(user);
        }
    }
}
