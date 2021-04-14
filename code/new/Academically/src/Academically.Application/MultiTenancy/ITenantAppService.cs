using Abp.Application.Services;
using Academically.MultiTenancy.Dto;

namespace Academically.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

