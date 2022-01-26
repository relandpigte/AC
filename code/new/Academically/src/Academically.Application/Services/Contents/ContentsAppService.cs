using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Contents.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.Contents
{
    public class ContentsAppService : AcademicallyAppServiceBase, IContentsAppService
    {
        private readonly IRepository<Content, Guid> _contentsRepository;

        public ContentsAppService(
            IRepository<Content, Guid> contentsRepository
            )
        {
            _contentsRepository = contentsRepository;
        }

        public async Task<ContentDto> GetAsync(string referenceId)
        {
            return await _contentsRepository.GetAll()
                .Where(e => e.ReferenceId == referenceId)
                .Select(e => ObjectMapper.Map<ContentDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task SaveAsync(ContentDto input)
        {
            var content = await _contentsRepository.GetAll()
                .Where(e => e.ReferenceId == input.ReferenceId)
                .FirstOrDefaultAsync();
            if (content == null)
            {
                content = new Content();
            }
            ObjectMapper.Map(input, content);
            await _contentsRepository.InsertOrUpdateAndGetIdAsync(content);
        }
    }
}
