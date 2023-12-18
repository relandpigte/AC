using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Timing;
using Castle.Core.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Dynamic.Core;
using Abp.Reflection.Extensions;
using System.Text;
using System.Globalization;
using Abp.IO.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using Academically.Domain.Entities;
using Academically.Domain.Services.Documents;
using Academically.Hubs;
using Microsoft.AspNetCore.SignalR;
using Academically.Domain.Enums;
using AutoMapper;
using Academically.Services.Coachings.Dto;
using Abp.ObjectMapping;
using Academically.Services.Events.Dto;
using System.Dynamic;

namespace Academically.Functions.Event.Notifier
{
    public class Executer : ITransientDependency
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _config;
        private readonly IHubContext<EventsHub> _eventsHub;
        private readonly IRepository<ServiceBooking, Guid> _serviceBookingsRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Domain.Entities.Event, Guid> _eventRepository;

        public Executer(
            IConfiguration config,
            ILogger logger,
            IHubContext<EventsHub> eventsHub,
            IRepository<ServiceBooking, Guid> serviceBookingsRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Domain.Entities.Event, Guid> eventRepository
        )
        {
            _config = config;
            _logger = logger;
            _eventsHub = eventsHub;
            _serviceBookingsRepository = serviceBookingsRepository;
            _coachingRepository = coachingRepository;
            _eventRepository = eventRepository;
        }

        [UnitOfWork(isTransactional: false)]
        public virtual async Task<bool> RunAsync()
        {
            var now = Clock.Now;
            var targetDate = now.AddMinutes(15);

            this._logger.Info($"[Event.Notifier] Checking for events that are starting within {targetDate} and earlier.");

            var candidateBookings = await this._serviceBookingsRepository.GetAll()
               .AsNoTracking()
               .Where(b => b.BookingDateTime >= now && b.BookingDateTime <= targetDate)
               .ToListAsync();

            if (candidateBookings != null && candidateBookings.Count > 0)
            {
                await CheckUpcomingCoachings(candidateBookings);
                await CheckUpcomingWorkshops(candidateBookings);
                await CheckUpcomingBroadcasts(candidateBookings);
            }

            return true;
        }

        [UnitOfWork]
        private async Task CheckUpcomingCoachings(List<ServiceBooking> bookings)
        {
            var candidateBookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var candidateCoachings = await _coachingRepository.GetAll()
                     .AsNoTracking()
                     .Include(c => c.CreatorUser)
                     .Where(c => candidateBookingIds.Any(i => i == c.Id))
                     .ToListAsync();

            foreach (var coaching in candidateCoachings)
            {
                this._logger.Info($"[Event.Notifier] Coaching {coaching.Id}:{coaching.Name} is due within 15 minutes.");
                try
                {
                    var booking = bookings.SingleOrDefault(b => b.ReferenceId == coaching.Id);
                    var obj = new ExpandoObject();
                    obj.TryAdd("Booking", booking);
                    obj.TryAdd("Data", coaching);
                    await this._eventsHub.Clients.Group($"{booking.CreatorUserId}").SendAsync(nameof(HubEvent.UpcomingEvent), obj);
                }
                catch (ArgumentNullException ex)
                {
                    this._logger.Error($"[Event.Notifier] Error trying to initialize transport object for {coaching.Id}:{coaching.Name}.");
                }
                
            }
        }

        [UnitOfWork]
        private async Task CheckUpcomingWorkshops(List<ServiceBooking> bookings)
        {
            var candidateBookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var candidateWorkshops = await _eventRepository.GetAll()
                    .AsNoTracking()
                    .Include(c => c.CreatorUser)
                    .Where(w => w.Category == EventCategory.Workshop)
                    .Where(c => candidateBookingIds.Any(i => i == c.Id))
                    .ToListAsync();

            foreach (var workshop in candidateWorkshops)
            {
                this._logger.Info($"[Event.Notifier] Workshop {workshop.Id}:{workshop.Name} is due within 15 minutes.");
                try
                {
                    var booking = bookings.SingleOrDefault(b => b.ReferenceId == workshop.Id);
                    var obj = new ExpandoObject();
                    obj.TryAdd("Booking", booking);
                    obj.TryAdd("Data", workshop);
                    await this._eventsHub.Clients.Group($"{booking.CreatorUserId}").SendAsync(nameof(HubEvent.UpcomingEvent), obj);
                }
                catch (ArgumentNullException ex)
                {
                    this._logger.Error($"[Event.Notifier] Error trying to initialize transport object for {workshop.Id}:{workshop.Name}.");
                }
            }
        }

        [UnitOfWork]
        private async Task CheckUpcomingBroadcasts(List<ServiceBooking> bookings)
        {
            var candidateBookingIds = bookings.Select(b => b.ReferenceId).ToList();

            var candidateBroadcasts = await _eventRepository.GetAll()
                    .AsNoTracking()
                    .Include(c => c.CreatorUser)
                    .Where(w => w.Category == EventCategory.Broadcast)
                    .Where(c => candidateBookingIds.Any(i => i == c.Id))
                    .ToListAsync();

            foreach (var broadcast in candidateBroadcasts)
            {
                this._logger.Info($"[Event.Notifier] Broadcast {broadcast.Id}:{broadcast.Name} is due within 15 minutes.");
                try
                {
                    var booking = bookings.SingleOrDefault(b => b.ReferenceId == broadcast.Id);
                    var obj = new ExpandoObject();
                    obj.TryAdd("Booking", booking);
                    obj.TryAdd("Data", broadcast);
                    await this._eventsHub.Clients.Group($"{booking.CreatorUserId}").SendAsync(nameof(HubEvent.UpcomingEvent), obj);
                }
                catch (ArgumentNullException ex)
                {
                    this._logger.Error($"[Event.Notifier] Error trying to initialize transport object for {broadcast.Id}:{broadcast.Name}.");
                }
            }
        }
    }
}
