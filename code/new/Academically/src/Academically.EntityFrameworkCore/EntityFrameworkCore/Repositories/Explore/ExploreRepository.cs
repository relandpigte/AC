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
