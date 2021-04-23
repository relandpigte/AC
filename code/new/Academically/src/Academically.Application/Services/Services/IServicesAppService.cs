using Abp.Application.Services;
using Academically.Services.Services.Dto;
using Academically.Services.UserServices.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Academically.Services.Services
{
    public interface IServicesAppService : IApplicationService
    {
        Task<IEnumerable<ServiceDto>> GetCategories();
        Task<IEnumerable<ServiceDto>> GetServices(Guid categoryId);
        Task<IEnumerable<ServiceMappingDto>> GetLevels(Guid categoryId, Guid serviceId);
        Task<IEnumerable<SubjectDto>> GetSubjects(string levelName);
    }
}
