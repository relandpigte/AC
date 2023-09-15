using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Events.Bus.Entities;
using Abp.Events.Bus.Handlers;
using Abp.ObjectMapping;
using Academically.Domain.Entities;
using Academically.Hubs;
using Academically.Users;
using Academically.Users.Dto;

namespace Academically.Events;

public class NewUserStatusLogEventHandler : ITransientDependency,
    IAsyncEventHandler<EntityCreatedEventData<UserStatusLog>>
{
    private readonly IObjectMapper _objectMapper;
    private readonly IHubManager _hubManager;
    private readonly IUserAppService _userAppService;
    
    public NewUserStatusLogEventHandler(
        IObjectMapper objectMapper,
        IHubManager hubManager,
        IUserAppService userAppService)
    {
        _objectMapper = objectMapper;
        _hubManager = hubManager;
        _userAppService = userAppService;
    }

    public async Task HandleEventAsync(EntityCreatedEventData<UserStatusLog> eventData)
    {
        var statusLog = await _userAppService.GetUserStatusLog(eventData.Entity.Id);
        await _hubManager.NotifyUsersForNewUserActivities(statusLog);
    }
}