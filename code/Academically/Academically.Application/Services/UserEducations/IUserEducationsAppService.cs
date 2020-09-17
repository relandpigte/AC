using System;
using System.Collections.Generic;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Entities.Enums;
using Academically.Services.UserEducations.Dto;

namespace Academically.Services.UserEducations
{
    public interface IUserEducationsAppService : IAsyncCrudAppService<UserEducationDto, Guid, PagedAndSortedResultRequestDto>
    {
        IEnumerable<EnumItem> GetLevels();
    }
}
