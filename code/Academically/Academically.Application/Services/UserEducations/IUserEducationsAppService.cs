using System;
using Abp.Application.Services;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.UserEducations
{
    public interface IUserEducationsAppService : IAsyncCrudAppService<UserEducationDto, Guid, PagedAndSortedUserEducationResultRequestDto>
    {
    }
}
