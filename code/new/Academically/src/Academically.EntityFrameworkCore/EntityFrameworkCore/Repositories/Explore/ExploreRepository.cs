using Abp.EntityFrameworkCore;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Views;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.EntityFrameworkCore.Repositories.Explore
{
    public class ExploreRepository : AcademicallyRepositoryBase<Video, Guid>, IExploreRepository
    {
        private readonly IDbContextProvider<AcademicallyDbContext> _dbContextProvider;

        public ExploreRepository(IDbContextProvider<AcademicallyDbContext> dbContextProvider) : base(dbContextProvider)
        {
            _dbContextProvider = dbContextProvider;
        }

        public async Task<List<ArticlePopularityViewModel>> GetPopularArticles(int skipCount, int maxCount, long? userIdFilter)
        {
            var articlesContext = _dbContextProvider.GetDbContext().Articles
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.Children)
                    .Include(e => e.CreatorUser)
                    .Where(e => e.ParentId == null)
                    .Where(e => e.Status == ArticleStatus.Published)
                    .Where(e => e.IsVisible)
                    //.WhereIf(input.userIdFilter.HasValue, e => e.CreatorUserId != userIdFilter.Value)
                    .AsQueryable();

            var studentArticles = _dbContextProvider.GetDbContext().StudentArticles.AsQueryable();

            // Get Top videos
            var topArticles = await studentArticles.Select(x => new
            {
                x.ArticleId,
                x.SaveOnly,
                Point = x.SaveOnly ? 1 : 5
            })
                .GroupBy(x => new { x.ArticleId })
                .Select(g => new { g.Key.ArticleId, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity)
                .PageBy(skipCount, maxCount)
                .ToListAsync();

            var articles = await articlesContext.Where(x => topArticles.Select(t => t.ArticleId).Contains(x.Id)).ToListAsync();

            var joinedArticles = articles.Join(
                                topArticles,
                                v => v.Id,
                                tv => tv.ArticleId,
                                (v, tv) => new ArticlePopularityViewModel(v, tv.Popularity))
                         .OrderByDescending(x => x.PopularityWeight);

            return joinedArticles.ToList();
        }

        public async Task<List<CoursePopularityViewModel>> GetPopularCourses(int skipCount, int maxCount, long? userIdFilter)
        {
            var coursesContext = _dbContextProvider.GetDbContext().Courses
                    .Include(e => e.ImageDocument)
                    .Include(e => e.CreatorUser)
                    .Where(e => e.Status == CourseStatus.Published)
                    .Where(e => e.IsVisible)
                    //.WhereIf(input.userIdFilter.HasValue, e => e.CreatorUserId != userIdFilter.Value)
                    .AsQueryable();

            var studentCourses = _dbContextProvider.GetDbContext().StudentCourses.AsQueryable();

            // Get Top videos
            var topCourses = await studentCourses.Select(x => new
            {
                x.CourseId,
                Point = 5
            })
                .GroupBy(x => new { x.CourseId })
                .Select(g => new { g.Key.CourseId, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity)
                .PageBy(skipCount, maxCount)
                .ToListAsync();

            var courses = await coursesContext.Where(x => topCourses.Select(t => t.CourseId).Contains(x.Id)).ToListAsync();

            var joinedCourses = courses.Join(
                                topCourses,
                                v => v.Id,
                                tv => tv.CourseId,
                                (v, tv) => new CoursePopularityViewModel(v, tv.Popularity))
                         .OrderByDescending(x => x.PopularityWeight);

            return joinedCourses.ToList();
        }

        public async Task<List<EventPopularityViewModel>> GetPopularEvents(int skipCount, int maxCount, long? userIdFilter)
        {
            var eventsContext = _dbContextProvider.GetDbContext().Events
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.Children)
                    .Include(e => e.CreatorUser)
                    .Where(e => e.ParentId == null)
                    .Where(e => e.Status == EventStatus.Published)
                    .Where(e => e.Visible.Value)
                    //.WhereIf(input.userIdFilter.HasValue, e => e.CreatorUserId != userIdFilter.Value)
                    .AsQueryable();

            var studentEvents = _dbContextProvider.GetDbContext().StudentEvents.AsQueryable();

            // Get Top videos
            var topEvents = await studentEvents.Select(x => new
            {
                x.EventId,
                x.SaveOnly,
                Point = x.SaveOnly ? 1 : 5
            })
                .GroupBy(x => new { x.EventId })
                .Select(g => new { g.Key.EventId, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity)
                .PageBy(skipCount, maxCount)
                .ToListAsync();

            var videos = await eventsContext.Where(x => topEvents.Select(t => t.EventId).Contains(x.Id)).ToListAsync();

            var joinedVideos = videos.Join(
                                topEvents,
                                v => v.Id,
                                tv => tv.EventId,
                                (v, tv) => new EventPopularityViewModel(v, tv.Popularity))
                         .OrderByDescending(x => x.PopularityWeight);
            return joinedVideos.ToList();
        }

        public async Task<List<VideoPopularityViewModel>> GetPopularVideos(int skipCount, int maxCount, long? userIdFilter)
        {
            var videosContext = _dbContextProvider.GetDbContext().Videos
                    .Include(e => e.ThumbnailDocument)
                    .Include(e => e.Children)
                    .Include(e => e.CreatorUser)
                    .Where(e => e.ParentId == null)
                    .Where(e => e.Status == VideoStatus.Published)
                    .Where(e => e.IsVisible)
                    //.WhereIf(input.userIdFilter.HasValue, e => e.CreatorUserId != userIdFilter.Value)
                    .AsQueryable();

            var studentVideos = _dbContextProvider.GetDbContext().StudentVideos.AsQueryable();

            // Get Top videos
            var topVideos = await studentVideos.Select(x => new
                    {
                        x.VideoId,
                        x.SaveOnly,
                        Point = x.SaveOnly ? 1 : 5
                    })
                .GroupBy(x => new { x.VideoId })
                .Select(g => new { g.Key.VideoId, Popularity = g.Sum(s => s.Point) })
                .OrderByDescending(x => x.Popularity)
                .PageBy(skipCount, maxCount)
                .ToListAsync();
            
            var videos = await videosContext.Where(x => topVideos.Select(t => t.VideoId).Contains(x.Id)).ToListAsync();

            var joinedVideos = videos.Join(
                                topVideos,
                                v => v.Id,
                                tv => tv.VideoId,
                                (v, tv) => new VideoPopularityViewModel(v, tv.Popularity))
                         .OrderByDescending(x => x.PopularityWeight);

            return joinedVideos.ToList();
        }

        
    }
}
