using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.StudentVideos.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.StudentVideos
{
    public class StudentVideosAppService : AcademicallyAppServiceBase, IStudentVideosAppService
    {
        private readonly IRepository<StudentVideo, Guid> _studentVideosRepository;
        private readonly IRepository<Video, Guid> _videosRepository;

        public StudentVideosAppService(
            IRepository<StudentVideo, Guid> studentVideosRepository,
            IRepository<Video, Guid> videosRepository
            )
        {
            _studentVideosRepository = studentVideosRepository;
            _videosRepository = videosRepository;
        }

        public async Task<PagedResultDto<StudentVideoDto>> GetAllAsync(GetAllStudentVideoDto input)
        {
            var query = _studentVideosRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId)
                .WhereIf(input.IsSavedFilter, e => e.SaveOnly)
                .WhereIf(!input.IsSavedFilter, e => !e.SaveOnly);
            var totalCount = await query.CountAsync();
            var studentVideos = await query.PageBy(input)
                .OrderBy(e => e.Video.Name)
                .Include(e => e.Video)
                    .ThenInclude(e => e.ThumbnailDocument)
                .Include(e => e.Video)
                    .ThenInclude(e => e.Children)
                .Select(e => ObjectMapper.Map<StudentVideoDto>(e))
                .ToListAsync();
            return new PagedResultDto<StudentVideoDto>(totalCount, studentVideos);
        }

        public async Task<GetStudentVideoDto> GetByVideoAsync(Guid videoId)
        {
            var studentVideo = await _studentVideosRepository.GetAll()
                .OrderByDescending(e => e.CreationTime)
                .FirstOrDefaultAsync(e => e.VideoId == videoId && e.CreatorUserId == AbpSession.UserId && !e.SaveOnly);
            if (studentVideo == null)
            {
                studentVideo = await _studentVideosRepository.GetAll()
                .OrderByDescending(e => e.CreationTime)
                .FirstOrDefaultAsync(e => e.VideoId == videoId && e.CreatorUserId == AbpSession.UserId && e.SaveOnly);
            }
            return ObjectMapper.Map<GetStudentVideoDto>(studentVideo);
        }

        public async Task<GetStudentVideoDto> CreateAsync(StudentVideoDto input)
        {
            if (!input.SaveOnly)
            {
                var video = await _videosRepository.GetAsync(input.VideoId);
                if (video.Type == VideoType.VideoSeries)
                {
                    var seriesVideos = await _videosRepository.GetAll()
                        .Where(e => e.ParentId == video.Id)
                        .ToListAsync();
                    foreach (var seriesVideo in seriesVideos)
                    {
                        var seriesStudentVideo = await _studentVideosRepository.GetAll()
                            .FirstOrDefaultAsync(e => e.VideoId == seriesVideo.Id && !e.SaveOnly);
                        if (seriesStudentVideo == null)
                        {
                            await _studentVideosRepository.InsertAsync(new StudentVideo()
                            {
                                VideoId = seriesVideo.Id,
                                SaveOnly = seriesVideo.PricingType == PricingType.Free,
                            });
                        }
                    }
                }
            }
            var studentVideo = ObjectMapper.Map<StudentVideo>(input);
            await _studentVideosRepository.InsertAsync(studentVideo);
            return ObjectMapper.Map<GetStudentVideoDto>(studentVideo);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _studentVideosRepository.DeleteAsync(id);
        }
    }
}

