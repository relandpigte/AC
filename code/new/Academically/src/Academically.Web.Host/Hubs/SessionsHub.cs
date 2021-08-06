using Abp;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.RealTime;
using Academically.Authorization.Users;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Web.Host.Hubs
{
    public class SessionsHub : AbpHubBase, ITransientDependency
    {
        public async Task StudentJoined(IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("startSession");
            }
        }

        public async Task ConnectStudent(IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("joinSession");
            }
        }

        public async Task StudentConnected(IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("admitStudent");
            }
        }

        public async Task AdmittingStudent(IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("waitForAdmission");
            }
        }

        public async Task EstablishConnection(IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("connectionEstablished");
            }
        }
    }
}
