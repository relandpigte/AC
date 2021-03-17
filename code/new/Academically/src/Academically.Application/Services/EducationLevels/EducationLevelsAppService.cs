using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.EducationLevels.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.EducationLevels
{
    public class EducationLevelsAppService : AcademicallyAppServiceBase, IEducationLevelsAppService
    {
        private readonly IRepository<EducationLevel, Guid> _educationLevelsRepository;

        public EducationLevelsAppService(
            IRepository<EducationLevel, Guid> educationLevelsRepository
            )
        {
            _educationLevelsRepository = educationLevelsRepository;
        }

        public async Task<IEnumerable<EducationLevelDto>> GetAll()
        {
            var educationLevels = await _educationLevelsRepository.GetAll()
                .OrderBy(e => e.DisplayOrder)
                .Select(e => ObjectMapper.Map<EducationLevelDto>(e))
                .ToListAsync();
            return educationLevels;
        }
    }
}
