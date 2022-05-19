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

        public async Task StartEvent(IEnumerable<long> userIds, string session)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("eventStarted", session);
            }
        }

        public async Task EnterAsAudience(long hostUserId, StudentEventDto studentEvent)
        {
            await Clients.User(hostUserId.ToString()).SendAsync("audienceEntered", studentEvent);
        }

        public async Task JoinAsAudience(long hostUserId, StudentEventDto studentEvent, string session)
        {
            await Clients.User(studentEvent.CreatorUser.Id.ToString()).SendAsync("audienceJoined", studentEvent, session);
            await Clients.User(hostUserId.ToString()).SendAsync("audienceJoined", studentEvent, session);
        }

        public async Task EnterAsGuest(long hostUserId, EventPresenterDto eventPresenter)
        {
            await Clients.User(hostUserId.ToString()).SendAsync("guestEntered", eventPresenter);
        }

        public async Task JoinAsGuest(long hostUserId, EventPresenterDto eventPresenter, string session)
        {
            await Clients.User(eventPresenter.UserId.Value.ToString()).SendAsync("guestJoined", eventPresenter, session);
            await Clients.User(hostUserId.ToString()).SendAsync("guestJoined", eventPresenter, session);
        }

        public async Task WaitAsGuest(long hostUserId, EventPresenterDto eventPresenter)
        {
            await Clients.User(hostUserId.ToString()).SendAsync("guestWaiting", eventPresenter);
        }

        public async Task AdmitGuest(long hostUserId, EventPresenterDto eventPresenter, string session)
        {
            await Clients.User(eventPresenter.UserId.Value.ToString()).SendAsync("guestAdmitted", eventPresenter, session);
        }

        public async Task AddIceCandidate(long userId, string iceCandidate)
        {
            await Clients.User(userId.ToString()).SendAsync("iceCandidatedAdded", iceCandidate);
        }

        public async Task StreamVideo(IEnumerable<long> userIds, string session)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("videoStreamed", session);
            }
        }

        public async Task StopVideoStream(IEnumerable<long> userIds, string session)
        {
            foreach (var userId in userIds)
            {
                await Clients.User(userId.ToString()).SendAsync("videoStreamStopped", session);
            }
        }
    }
}

