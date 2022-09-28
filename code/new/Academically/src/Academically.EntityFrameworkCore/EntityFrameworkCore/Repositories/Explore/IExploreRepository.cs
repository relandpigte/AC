using Academically.Domain.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.EntityFrameworkCore.Repositories.Explore
{
    public interface IExploreRepository
    {
        Task<List<VideoPopularityViewModel>> GetPopularVideos(int skipCount, int maxCount, long? userIdFilter);
    }
}
