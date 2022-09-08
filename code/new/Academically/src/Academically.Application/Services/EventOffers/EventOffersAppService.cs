

using Abp.Application.Services;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.EventOffers.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.EventOffers
{
    public class EventOffersAppService : AsyncCrudAppService<EventOffer, EventOfferDto, Guid, PagedEventOfferResultRequestDto, CreateEventOfferDto>, IEventOffersAppService
    {
        private readonly IRepository<EventOffer, Guid> _repository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Course, Guid> _courseRepository;
        private readonly IRepository<Video, Guid> _videoRepository;
        private readonly IRepository<Workshop, Guid> _workshopRepository;
        private readonly IRepository<Article, Guid> _articleRepository;

        public EventOffersAppService(
            IRepository<EventOffer, Guid> repository,
            IRepository<Event, Guid> eventRepository,
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Course, Guid> courseRepository,
            IRepository<Video, Guid> videoRepository,
            IRepository<Workshop, Guid> workshopRepository,
            IRepository<Article, Guid> articleRepository
            ) : base(repository)
        {
            _repository = repository;
            _eventRepository = eventRepository;
            _coachingRepository = coachingRepository;
            _courseRepository = courseRepository;
            _videoRepository = videoRepository;
            _workshopRepository = workshopRepository;
            _articleRepository = articleRepository;
        }

        public async Task<IEnumerable<EventOfferDto>> GetAllUnpagedAsync(Guid eventId)
        {
            return await Repository.GetAll()
                .Where(e => e.EventId == eventId)
                .Select(e => ObjectMapper.Map<EventOfferDto>(e))
                .ToListAsync();
        }

        public async Task<IEnumerable<MyServiceViewDto>> GetAllMyServices()
        {
            var myServices = new List<MyServiceViewDto>();
            
            // Get all courses
            
            myServices.Add(await GetCourses());
            myServices.Add(await GetCoachings());
            myServices.Add(await GetEvents());
            myServices.Add(await GetArticles());
            myServices.Add(await GetWorkshops());
            myServices.Add(await GetVideos());

            return myServices;
        }

        private async Task<MyServiceViewDto> GetCourses()
        {
            var courses = await _courseRepository.GetAll().Select(c => new { c.Id, c.Name }).OrderBy(x => x.Name).ToListAsync();
            var courseServices = new MyServiceViewDto();
        
            courseServices.Items = new List<MyServiceItemViewDto>();
            courseServices.ServiceType = ServiceTypeNames.Courses;

            foreach (var course in courses)
            {
                var newCourseItem = new MyServiceItemViewDto();
                newCourseItem.Id = course.Id;
                newCourseItem.ServiceType = EventOfferServiceTypes.Course;
                newCourseItem.Title = course.Name;
                courseServices.Items.Add(newCourseItem);
            }
            return courseServices;
        }

        private async Task<MyServiceViewDto> GetCoachings()
        {
            var coachings = await _coachingRepository.GetAll().Select(c => new { c.Id, c.Name }).OrderBy(x => x.Name).ToListAsync();
            var coachingServices = new MyServiceViewDto();
            
            coachingServices.Items = new List<MyServiceItemViewDto>();
            coachingServices.ServiceType = ServiceTypeNames.Coachings;
            
            foreach (var coaching in coachings)
            {
                var newCoachingItem = new MyServiceItemViewDto();
                newCoachingItem.Id = coaching.Id;
                newCoachingItem.ServiceType = EventOfferServiceTypes.Coaching;
                newCoachingItem.Title = coaching.Name;
                coachingServices.Items.Add(newCoachingItem);
            }
            return coachingServices;
        }

        private async Task<MyServiceViewDto> GetArticles()
        {
            var articles = await _articleRepository.GetAll().Select(c => new { c.Id, c.Name }).OrderBy(x => x.Name).ToListAsync();
            var articleServices = new MyServiceViewDto();

            articleServices.Items = new List<MyServiceItemViewDto>();
            articleServices.ServiceType = ServiceTypeNames.Articles;

            foreach (var article in articles)
            {
                var newArticleItem = new MyServiceItemViewDto();
                newArticleItem.Id = article.Id;
                newArticleItem.ServiceType = EventOfferServiceTypes.Articles;
                newArticleItem.Title = article.Name;
                articleServices.Items.Add(newArticleItem);
            }
            return articleServices;
        }

        private async Task<MyServiceViewDto> GetEvents()
        {
            var events = await _articleRepository.GetAll().Select(c => new { c.Id, c.Name }).OrderBy(x => x.Name).ToListAsync();
            var eventServices = new MyServiceViewDto();

            eventServices.Items = new List<MyServiceItemViewDto>();
            eventServices.ServiceType = ServiceTypeNames.Events;

            foreach (var eventItem in events)
            {
                var newEventItem = new MyServiceItemViewDto();
                newEventItem.Id = eventItem.Id;
                newEventItem.ServiceType = EventOfferServiceTypes.Event;
                newEventItem.Title = eventItem.Name;
                eventServices.Items.Add(newEventItem);
            }
            return eventServices;
        }

        private async Task<MyServiceViewDto> GetWorkshops()
        {
            var workshops = await _workshopRepository.GetAll().Select(c => new { c.Id, c.Name }).OrderBy(x => x.Name).ToListAsync();
            var workshopServices = new MyServiceViewDto();

            workshopServices.Items = new List<MyServiceItemViewDto>();
            workshopServices.ServiceType = ServiceTypeNames.Workshops;

            foreach (var workshopItem in workshops)
            {
                var newWorkshopItem = new MyServiceItemViewDto();
                newWorkshopItem.Id = workshopItem.Id;
                newWorkshopItem.ServiceType = EventOfferServiceTypes.Workshop;
                newWorkshopItem.Title = workshopItem.Name;
                workshopServices.Items.Add(newWorkshopItem);
            }
            return workshopServices;
        }

        private async Task<MyServiceViewDto> GetVideos()
        {
            var videos = await _articleRepository.GetAll().Select(c => new { c.Id, c.Name }).OrderBy(x => x.Name).ToListAsync();
            var videoServices = new MyServiceViewDto();

            videoServices.Items = new List<MyServiceItemViewDto>();
            videoServices.ServiceType = ServiceTypeNames.Videos;

            foreach (var eventItem in videos)
            {
                var newVideoItem = new MyServiceItemViewDto();
                newVideoItem.Id = eventItem.Id;
                newVideoItem.ServiceType = EventOfferServiceTypes.Video;
                newVideoItem.Title = eventItem.Name;
                videoServices.Items.Add(newVideoItem);
            }
            return videoServices;
        }
    }
}
