using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Academically.Authorization;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.UserEducations.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Academically.Services.UserEducations
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Education)]
    public class UserEducationsAppService : AcademicallyAppServiceBase, IUserEducationsAppService
    {
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        private readonly IRepository<University, Guid> _universitesRepository;
        private readonly IRepository<UserEducationLevel, Guid> _userEducationLevelsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public UserEducationsAppService(
            IRepository<UserEducation, Guid> userEducationsRepository,
            IRepository<University, Guid> universitesRepository,
            IRepository<UserEducationLevel, Guid> userEducationLevelsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _userEducationsRepository = userEducationsRepository;
            _universitesRepository = universitesRepository;
            _userEducationLevelsRepository = userEducationLevelsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<IEnumerable<UserEducationDto>> GetAll(long userId)
        {
            var userEducations = await _userEducationsRepository.GetAll()
                .Include(e => e.University)
                .Include(e => e.UserEducationLevels)
                    .ThenInclude(e => e.EducationLevel)
                .Include(e => e.UserEducationDocuments)
                    .ThenInclude(e => e.Document)
                .Where(e => e.UserId == userId)
                .Select(e => ObjectMapper.Map<UserEducationDto>(e))
                .ToListAsync();
            return userEducations;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Create)]
        public async Task<Guid> Create(UserEducationDto input)
        {
            var university = await CreateAndGetUniverisityIfNotExists(input.UniversityName, input.UniversityCountryCode);
            var userEducaton = ObjectMapper.Map<UserEducation>(input);
            userEducaton.UniversityId = university.Id;
            userEducaton.UserId = AbpSession.UserId.Value;
            return await _userEducationsRepository.InsertAndGetIdAsync(userEducaton);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Update)]
        public async Task<Guid> Update(UserEducationDto input)
        {
            var userEducationLevelInputs = input.UserEducationLevels;
            input.UserEducationLevels = null;

            var university = await CreateAndGetUniverisityIfNotExists(input.UniversityName, input.UniversityCountryCode);
            var userEducation = await _userEducationsRepository.GetAsync(input.Id);
            ObjectMapper.Map(input, userEducation);
            userEducation.UniversityId = university.Id;

            var userEducationLevels = await _userEducationLevelsRepository.GetAll()
                .Where(e => e.UserEducationId == userEducation.Id)
                .ToListAsync();
            foreach (var userEducationLevelInput in userEducationLevelInputs)
            {
                var userEducationLevel = userEducationLevels.FirstOrDefault(e => e.Id == userEducationLevelInput.Id);
                if (userEducationLevel == null)
                {
                    userEducationLevel = new UserEducationLevel();
                }
                ObjectMapper.Map(userEducationLevelInput, userEducationLevel);
                userEducationLevel.UserEducationId = userEducation.Id;
                await _userEducationLevelsRepository.InsertOrUpdateAsync(userEducationLevel);
            }
            foreach (var userEducationLevel in userEducationLevels)
            {
                if (userEducationLevelInputs.FirstOrDefault(e => e.Id == userEducationLevel.Id) == null)
                {
                    await _userEducationLevelsRepository.DeleteAsync(userEducationLevel.Id);
                }
            }
            await _userEducationsRepository.UpdateAsync(userEducation);
            return userEducation.Id;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Delete)]
        public async Task Delete(Guid id)
        {
            await _userEducationLevelsRepository.DeleteAsync(e => e.UserEducationId == id);
            await _userEducationsRepository.DeleteAsync(id);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Create, PermissionNames.Pages_Profile_Education_Qualifications_Update)]
        public async Task UploadDocuments([FromForm] UploadUserEducationDocumentsDto input)
        {
            if (input.Documents != null)
            {
                var userEducation = await _userEducationsRepository.GetAsync(input.UserEducationId);
                var categories = JsonConvert.DeserializeObject<List<string>>(input.Categories);
                int counter = 0;
                foreach (var documentToUpload in input.Documents)
                {
                    var document = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, documentToUpload, DocumentType.Education);
                    userEducation.UserEducationDocuments.Add(new UserEducationDocument()
                    {
                        DocumentId = document.Id,
                        Category = categories[counter],
                        IsReviewed = false,
                    });
                    counter++;
                }
                await _userEducationsRepository.UpdateAsync(userEducation);
            }
        }

        private async Task<University> CreateAndGetUniverisityIfNotExists(string universityName, string universityCountryCode)
        {
            var university = await _universitesRepository.FirstOrDefaultAsync(e => e.HeProvider.ToLower().Equals(universityName.ToLower()));
            if (university == null)
            {
                university = new University()
                {
                    HeProvider = universityName,
                    CountryCode = universityCountryCode,
                };
                await _universitesRepository.InsertAndGetIdAsync(university);
            }
            return university;
        }
    }
}
