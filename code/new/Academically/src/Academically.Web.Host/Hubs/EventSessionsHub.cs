using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
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
    }
}

