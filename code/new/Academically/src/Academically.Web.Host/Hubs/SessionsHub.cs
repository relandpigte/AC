using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Microsoft.AspNetCore.SignalR;

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

        public async Task EstablishConnection(int durationInSeconds, IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("connectionEstablished", durationInSeconds);
            }
        }

        public async Task ToggleAudio(bool isEnabled, IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("audioToggled", isEnabled);
            }
        }

        public async Task ShareScreen(long presenterUserId, IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("screenShared", presenterUserId);
            }
        }

        public async Task StopScreenShare(long presenterUserId, IEnumerable<long> userIds)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("screenShareStopped", presenterUserId);
            }
        }
    }
}
