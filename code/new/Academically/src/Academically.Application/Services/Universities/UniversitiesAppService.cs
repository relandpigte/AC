using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.Universities.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.Universities
{
    public class UniversitiesAppService : AcademicallyAppServiceBase, IUniversitiesAppService
    {
        private readonly IRepository<University, Guid> _universitiesRepository;

        public UniversitiesAppService(
            IRepository<University, Guid> universitiesRepository
            )
        {
            _universitiesRepository = universitiesRepository;
        }

        public async Task<IEnumerable<UniversityDto>> Search(string countryCode, string query)
        {
            query = query?.ToLower();
            var universities = await _universitiesRepository.GetAll()
                .Where(e => e.CountryCode == countryCode && e.IsReviewed)
                .Where(e => e.HeProvider.ToLower().Contains(query))
                .OrderBy(e => e.HeProvider)
                .Select(e => ObjectMapper.Map<UniversityDto>(e))
                .ToListAsync();
            return universities;
        }
    }
}
