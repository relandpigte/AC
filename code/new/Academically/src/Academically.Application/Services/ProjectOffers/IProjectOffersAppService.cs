using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.ProjectOffers.Dto;
using Academically.Services.Projects.Dto;

namespace Academically.Services.ProjectOffers
{
    public interface IProjectOffersAppService : IApplicationService
    {
        Task<PagedResultDto<ProjectOfferDto>> GetAllAsync(PagedProjectOfferRequestDto input);
        Task<ProjectOfferDto> GetAsync(Guid id);
        Task CreateAsync(CreateProjectOfferDto input);
        Task Accept(Guid id);
    }
}
