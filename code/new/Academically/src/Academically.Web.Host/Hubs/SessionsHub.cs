using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace Academically.Web.Host.Hubs
{
    public class SessionsHub : AbpHubBase, ITransientDependency
    {
        private readonly IRepository<Session, Guid> _sessionsRepository;

        public SessionsHub(
            IRepository<Session, Guid> sessionsRepository
            )
        {
            _sessionsRepository = sessionsRepository;
        }

        public async Task SendCall(Guid id)
        {
            var call = await _sessionsRepository.GetAsync(id);
            await Clients.All.SendAsync("getCall", call);
        }
    }
}
