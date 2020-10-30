using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Entities;
using Academically.Services.SupportServices.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.SupportServices
{
    public class SupportServicesAppService : AcademicallyAppServiceBase, ISupportServicesAppService
    {
        private readonly IRepository<SupportService, Guid> _supportServicesRepository;
        private readonly IRepository<UserSupportService, Guid> _userSupportServicesRepository;

        public SupportServicesAppService(
            IRepository<SupportService, Guid> supportServicesRepository,
            IRepository<UserSupportService, Guid> userSupportServicesRepository
            )
        {
            _supportServicesRepository = supportServicesRepository;
            _userSupportServicesRepository = userSupportServicesRepository;
        }

        public async Task<IEnumerable<SupportServiceDto>> GetAll(long userId)
        {
            var userSupportServiceIds = _userSupportServicesRepository.GetAll()
                .Where(e => e.UserId == userId)
                .Select(e => e.SupportServiceId.ToString());
            var supportServices = await _supportServicesRepository.GetAll()
                .Where(e => !userSupportServiceIds.Any(t => e.ParentIdMap.Contains(t)))
                .ToListAsync();
            var rootSupportServices = GetChildren(supportServices, null);

            return rootSupportServices;
        }

        private IEnumerable<SupportServiceDto> GetChildren(IEnumerable<SupportService> supportServices, Guid? parentId)
        {
            var children = supportServices.Where(e => e.ParentId == parentId)
                .Select(e => ObjectMapper.Map<SupportServiceDto>(e))
                .ToList();
            foreach (var child in children)
            {
                child.Children = GetChildren(supportServices, child.Id);
            }
            return children;
        }
    }
}
