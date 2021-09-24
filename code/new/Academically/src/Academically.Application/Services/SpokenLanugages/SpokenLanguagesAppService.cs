using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.SpokenLanugages.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.SpokenLanugages
{
    public class SpokenLanguagesAppService : AcademicallyAppServiceBase, ISpokenLanguageAppService
    {
        private readonly IRepository<SpokenLanguage, Guid> _spokenLanguages;
        public SpokenLanguagesAppService(IRepository<SpokenLanguage, Guid> spokenLanguages)
        {
            _spokenLanguages = spokenLanguages;
        }

        public async Task<IEnumerable<SpokenLanguageDto>> Get()
        {
            var spokenLanguages = await _spokenLanguages.GetAll()
                .OrderBy(s => s.Name)
                .Select(s => ObjectMapper.Map<SpokenLanguageDto>(s))
                .ToListAsync();

            return spokenLanguages;
        }

        public async Task<IEnumerable<SpokenLanguageDto>> GetAll()
        {
            return await _spokenLanguages.GetAll()
                .OrderBy(e => e.Name)
                .Select(e => ObjectMapper.Map<SpokenLanguageDto>(e))
                .ToListAsync();
        }
    }
}
