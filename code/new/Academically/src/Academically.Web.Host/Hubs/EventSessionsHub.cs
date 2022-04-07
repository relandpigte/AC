using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Academically.Services.Events.Dto;
using Microsoft.AspNetCore.SignalR;

namespace Academically.Web.Host.Hubs
{
    public class EventSessionsHub : AbpHubBase, ITransientDependency
    {
        public async Task EstablishConnection(int durationInSeconds, IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("connectionEstablished", durationInSeconds);
            }
        }

        public async Task StartEvent(IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("eventStarted");
            }
        }

        public async Task JoinAsAudience(long hostUserId, StudentEventDto studentEvent)
        {
            await Clients.User(studentEvent.CreatorUser.Id.ToString()).SendAsync("audienceJoined", studentEvent);
            await Clients.User(hostUserId.ToString()).SendAsync("audienceJoined", studentEvent);
        }
    }
}

