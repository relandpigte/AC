using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.Localization;
using Abp.Timing;
using Academically.Application.Shared.Services;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Newtonsoft.Json;

namespace Academically.Domain.Events.Handlers
{
    public class PhoneVerificationsEventHandler :
        EventHandlerBase,
        IAsyncEventHandler<EntityCreatingEventData<PhoneVerification>>
    {
        private readonly IRepository<User, long> _usersRepository;
        private readonly ISmsService _smsService;

        public PhoneVerificationsEventHandler(
            IRepository<User, long> usersRepository,
            ISmsService smsService,
            ILocalizationManager localizationManager
            ) : base(localizationManager)
        {
            _usersRepository = usersRepository;
            _smsService = smsService;
        }

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatingEventData<PhoneVerification> eventData)
        {
            await SendVerificationCode(eventData.Entity.Recipient, eventData.Entity.Code);
            eventData.Entity.DateSent = Clock.Now;
        }

        private async Task SendVerificationCode(string recipient, string code)
        {
            var message = L("PhoneNumberVerificationSmsMessage", code);
            dynamic recipientNo = JsonConvert.DeserializeObject(recipient);

            await _smsService.SendAsync(AcademicallyConsts.DefaultSmsSender, recipientNo.internationalNumber.Value, message);
        }
    }
}
