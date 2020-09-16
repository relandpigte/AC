using System.Threading.Tasks;
using Abp.Application.Services;
using Academically.Services.Widgets.Dto;

namespace Academically.Services.Widgets
{
    public interface IWidgetsAppService : IApplicationService
    {
        Task<ProfileSummaryWidgetDto> GetProfileSummary();
    }
}
