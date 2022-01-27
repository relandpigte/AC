using Abp.Application.Services;
using Academically.Services.ContentMargins.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.ContentMargins
{
    public interface IContentMarginsAppService : IApplicationService
    {
        Task<IEnumerable<ContentMarginDto>> GetAllAsync();
        Task<ContentMarginDto> GetAsync(Guid id);
        Task<ContentMarginDto> CreateAsync(ContentMarginDto input);
        Task<ContentMarginDto> UpdateAsync(ContentMarginDto input);
        Task DeleteAsync(Guid id);
    }
}
