using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.EventSessions.Dto;
using Academically.Users.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.EventSessions
{
	public class EventSessionsAppService : AcademicallyAppServiceBase, IEventSessionsAppService
	{
		private readonly IRepository<Event, Guid> _eventsRepository;
		private readonly IRepository<StudentEvent, Guid> _studentEventsRepository;
		private readonly IRepository<EventPresenter, Guid> _eventPresentersRepository;

        public EventSessionsAppService(
			IRepository<Event, Guid> eventsRepository,
			IRepository<StudentEvent, Guid> studentEventsRepository,
			IRepository<EventPresenter, Guid> eventPresentersRepository
			)
        {
			_eventsRepository = eventsRepository;
			_studentEventsRepository = studentEventsRepository;
			_eventPresentersRepository = eventPresentersRepository;

		}

        public async Task<UserDto> GetInvitedUser(Guid invitationId)
        {
			var eventPresenter = await _eventPresentersRepository.GetAll()
				.Include(e => e.User)
				.FirstOrDefaultAsync(e => e.Id == invitationId);
			return ObjectMapper.Map<UserDto>(eventPresenter.User);
        }

        public async Task<IEnumerable<EventUserDto>> GetUsers(Guid eventId)
        {
			var @event = await _eventsRepository.GetAll()
				.Include(e => e.CreatorUser)
					.ThenInclude(e => e.ProfilePictureDocument)
				.Include(e => e.EventPresenters)
					.ThenInclude(e => e.User)
						.ThenInclude(e => e.ProfilePictureDocument)
				.Include(e => e.StudentEvents)
					.ThenInclude(e => e.CreatorUser)
						.ThenInclude(e => e.ProfilePictureDocument)
				.FirstOrDefaultAsync(e => e.Id == eventId);

			var host = ObjectMapper.Map<UserDto>(@event.CreatorUser);
			var eventUsers = new List<EventUserDto>();
			eventUsers.Add(new EventUserDto()
            {
				User = host,
				Type = EventUserType.Host,
            });

			if (@event.EventPresenters.Any())
			{
                foreach (var presenter in @event.EventPresenters)
                {
					eventUsers.Add(new EventUserDto()
					{
						User = ObjectMapper.Map<UserDto>(presenter.User),
						Type = presenter.Type == EventPresenterType.CoHost ? EventUserType.CoHost : EventUserType.Guest,
					});
                }
			}

			if (@event.StudentEvents.Any())
			{
				foreach (var studentEvent in @event.StudentEvents)
				{
					eventUsers.Add(new EventUserDto()
					{
						User = ObjectMapper.Map<UserDto>(studentEvent.CreatorUser),
						Type = EventUserType.Audience,
					});
				}
			}

			return eventUsers;
		}
    }
}

