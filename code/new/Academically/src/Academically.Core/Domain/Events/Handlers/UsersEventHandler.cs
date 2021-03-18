using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Academically.Authorization.Users;
using System.Threading.Tasks;

namespace Academically.Domain.Events.Handlers
{
    public class UsersEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatedEventData<User>>
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
        public async Task HandleEventAsync(EntityCreatedEventData<User> eventData)
        {
            if (eventData.Entity.IsLockoutEnabled)
            {
                var user = await _usersRepository.GetAsync(eventData.Entity.Id);
                user.IsLockoutEnabled = false;
                await _usersRepository.UpdateAsync(user);
            }
        }
    }
}
