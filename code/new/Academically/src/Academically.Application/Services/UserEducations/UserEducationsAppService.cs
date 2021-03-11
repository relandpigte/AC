using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.UserEducations.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.UserEducations
{
    public class UserEducationsAppService: AcademicallyAppServiceBase, IUserEducationsAppService
    {
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        private readonly IRepository<University, Guid> _universitesRepository;

        public UserEducationsAppService(
            IRepository<UserEducation, Guid> userEducationsRepository,
            IRepository<University, Guid> universitesRepository
            )
        {
            _userEducationsRepository = userEducationsRepository;
            _universitesRepository = universitesRepository;
        }

        public async Task<IEnumerable<UserEducationDto>> GetAll(long userId)
        {
            var userEducations = await _userEducationsRepository.GetAll()
                .Include(e => e.University)
                .Include(e => e.UserEducationLevels)
                    .ThenInclude(e => e.EducationLevel)
                .Where(e => e.UserId == userId)
                .Select(e => ObjectMapper.Map<UserEducationDto>(e))
                .ToListAsync();
            return userEducations;
        }

        public async Task Create(UserEducationDto input)
        {
            var university = await _universitesRepository.FirstOrDefaultAsync(e => e.HeProvider.ToLower().Equals(input.UniversityName.ToLower()));
            if (university == null)
            {
                university = new University()
                {
                    HeProvider = input.UniversityName,
                    CountryCode = input.UniversityCountryCode,
                };
                await _universitesRepository.InsertAndGetIdAsync(university);
            }
            var userEducaton = ObjectMapper.Map<UserEducation>(input);
            userEducaton.UniversityId = university.Id;
            userEducaton.UserId = AbpSession.UserId.Value;
            await _userEducationsRepository.InsertAsync(userEducaton);
        }
    }
}
