using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.ContentMargins.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.ContentMargins
{
    public class ContentMarginsAppService : AcademicallyAppServiceBase, IContentMarginsAppService
    {
        private readonly IRepository<ContentMargin, Guid> _contentMarginsRepository;

        public ContentMarginsAppService(
            IRepository<ContentMargin, Guid> contentMarginsRepository
            )
        {
            _contentMarginsRepository = contentMarginsRepository;
        }

        public async Task<IEnumerable<ContentMarginDto>> GetAllAsync()
        {
            return await _contentMarginsRepository.GetAll()
                .Where(e => e.CreatorUserId == AbpSession.UserId.Value)
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ContentMarginDto>(e))
                .ToListAsync();
        }

        public async Task<ContentMarginDto> GetAsync(Guid id)
        {
            return await _contentMarginsRepository.GetAll()
                .Where(e => e.Id == id)
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<ContentMarginDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task<ContentMarginDto> CreateAsync(ContentMarginDto input)
        {
            var content = ObjectMapper.Map<ContentMargin>(input);
            input.Id = await _contentMarginsRepository.InsertAndGetIdAsync(content);
            return input;
        }

        public async Task<ContentMarginDto> UpdateAsync(ContentMarginDto input)
        {
            var content = await _contentMarginsRepository.GetAsync(input.Id.Value);
            ObjectMapper.Map(input, content);
            await _contentMarginsRepository.UpdateAsync(content);
            return input;
        }

        public async Task DeleteAsync(Guid id)
        {
            await _contentMarginsRepository.DeleteAsync(id);
        }
    }
}
