using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Academically.Services.References.Dto;
using Academically.Users.Dto;
using System;

namespace Academically.Services.References
{
    public interface IReferencesAppService : IAsyncCrudAppService<ReferenceDto, Guid, PagedReferenceResultRequestDto, CreateReferenceDto, UpdateReferenceDto>
    {
    }
}
