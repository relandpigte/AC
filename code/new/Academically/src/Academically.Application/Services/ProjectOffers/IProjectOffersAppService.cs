using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.ProjectOffers.Dto;

namespace Academically.Services.ProjectOffers
{
    public interface IProjectOffersAppService : IApplicationService
    {
        Task CreateAsync(CreateProjectOfferDto input);
    }
}
