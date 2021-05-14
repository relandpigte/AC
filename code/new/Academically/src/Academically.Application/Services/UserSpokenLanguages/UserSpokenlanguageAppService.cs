using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.UserSpokenLanguages;
using Academically.Services.UserSpokenLanguages.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.SpokenLanguages
{
    public class UserSpokenlanguageAppService : AcademicallyAppServiceBase, IUserSpokenlanguageAppService
    {
        private readonly IRepository<UserSpokenLanguage, Guid> _userSpokenLanguageRepository;
        private readonly IRepository<SpokenLanguage, Guid> _spokenLanguagesRepository;


        public UserSpokenlanguageAppService(
            IRepository<UserSpokenLanguage, Guid> userSpokenLanguageRepository, 
            IRepository<SpokenLanguage, Guid> spokenLanguagesRepository)
        {
            _userSpokenLanguageRepository = userSpokenLanguageRepository;
            _spokenLanguagesRepository = spokenLanguagesRepository;
        }

        public async Task<IEnumerable<UserSpokenLanguageDto>> GetUserSpokenLanguages(long userId)
        {
            var spokenLanguages = await _userSpokenLanguageRepository.GetAll()
                .Where(s => s.UserId == userId)
                .Include(s => s.SpokenLanguage)
                .OrderBy(s => s.SpokenLanguage.Name)
                .ToListAsync();

            var result = new List<UserSpokenLanguageDto>();
            foreach (var spokenLanguage in spokenLanguages)
            {
                var spokenLanguageDto = new UserSpokenLanguageDto();
                spokenLanguageDto.Id = spokenLanguage.Id;
                spokenLanguageDto.UserId = spokenLanguage.UserId;
                spokenLanguageDto.SpokenLanguageId = spokenLanguage.SpokenLanguageId;
                spokenLanguageDto.SpokenLanguageName = spokenLanguage.SpokenLanguage.Name;
                spokenLanguageDto.Proficiency = spokenLanguage.Proficiency;
                result.Add(spokenLanguageDto);
            }

            return result;
        }

        public async Task EditUserSpokenLanguages(EditUserSpokenLanguagesDto editUserSpokenLanguagesDto)
        {
            var userSpokenLanguages = await _userSpokenLanguageRepository.GetAll()
                .Where(s => s.UserId == editUserSpokenLanguagesDto.UserId)
                .ToListAsync();

            foreach (var userSpokenLanguage in userSpokenLanguages)
            {
                await _userSpokenLanguageRepository.DeleteAsync(userSpokenLanguage.Id);
            }

            // Insert user english spoken language
            //
            var spokenLanguageEnglish = _spokenLanguagesRepository.GetAll().Where(s => s.Name.ToLower() == "english").FirstOrDefault();
            if (spokenLanguageEnglish != null)
            {
                var userSpokenLanguage = new UserSpokenLanguage();
                userSpokenLanguage.UserId = editUserSpokenLanguagesDto.UserId;
                userSpokenLanguage.SpokenLanguageId = spokenLanguageEnglish.Id;
                userSpokenLanguage.Proficiency = editUserSpokenLanguagesDto.EnglishProficiency;
                await _userSpokenLanguageRepository.InsertAsync(userSpokenLanguage);
            }

            // Insert other user spoken languages
            //
            foreach (var otherUserSpokenLanguage in editUserSpokenLanguagesDto.OtherUserSpokenLanguages)
            {
                var userSpokenLanguage = new UserSpokenLanguage();
                userSpokenLanguage.UserId = editUserSpokenLanguagesDto.UserId;
                userSpokenLanguage.SpokenLanguageId = otherUserSpokenLanguage.SpokenLanguageId;
                userSpokenLanguage.Proficiency = otherUserSpokenLanguage.Proficiency;
                await _userSpokenLanguageRepository.InsertAsync(userSpokenLanguage);
            }
        }
    }
}
