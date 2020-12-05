using System.Threading.Tasks;
using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Authorization.Users;

namespace Academically.Events.Handlers
{
    public class UsersEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<UserLoginAttempt>>
    {
        private readonly IRepository<User, long> _usersRepository;

        public UsersEventHandler(
            IRepository<User, long> usersRepository,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEventData<UserLoginAttempt> eventData)
        {
            if (eventData.Entity.UserId.HasValue)
            {
                var user = await _usersRepository.GetAsync(eventData.Entity.UserId.Value);
                user.LastLoginTime = eventData.Entity.CreationTime;
                await _usersRepository.UpdateAsync(user);
            }
        }
    }
}
