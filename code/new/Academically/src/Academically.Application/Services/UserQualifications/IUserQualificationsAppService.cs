using Abp.Application.Services;
using Academically.Services.UserQualifications.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.UserQualifications
{
    public interface IUserQualificationsAppService : IApplicationService
    {
        Task<IEnumerable<UserQualificationDto>> GetAll();
        Task Create(CreateEditUserQualificationDto input);
        Task Update(Guid id, CreateEditUserQualificationDto input);
        Task Delete(Guid id);
        Task DeleteDocument(Guid userQualificationDocumentId);
    }
}
