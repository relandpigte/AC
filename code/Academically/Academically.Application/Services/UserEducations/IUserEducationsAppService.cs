using System;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.UserEducations
{
    public interface IUserEducationsAppService : IAsyncCrudAppService<UserEducationDto, Guid, PagedAndSortedResultRequestDto>
    {
    }
}
