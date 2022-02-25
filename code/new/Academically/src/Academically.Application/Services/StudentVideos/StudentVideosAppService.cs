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

		public StudentVideosAppService(
            IRepository<StudentVideo, Guid> studentVideosRepository
            )
		{
            _studentVideosRepository = studentVideosRepository;
        }

        public async Task<PagedResultDto<StudentVideoDto>> GetAll(GetAllStudentVideoDto input)
        {
            var query = _studentVideosRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId)
                .WhereIf(input.IsSavedFilter, e => e.Video.PricingType == PricingType.Free)
                .WhereIf(!input.IsSavedFilter, e => e.Video.PricingType != PricingType.Free);
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

        public async Task<StudentVideoDto> GetByVideo(Guid videoId)
        {
            return await _studentVideosRepository.GetAll()
                .Where(e => e.VideoId == videoId && e.CreatorUserId == AbpSession.UserId)
                .Select(e => ObjectMapper.Map<StudentVideoDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task Create(Guid videoId)
        {
            await _studentVideosRepository.InsertAsync(new StudentVideo()
            {
                VideoId = videoId,
            });
        }
    }
}

