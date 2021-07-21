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
using Academically.Services.Universities.Dto;
using Academically.Services.UserEducations.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Academically.Services.UserEducations
{
    [AbpAuthorize(PermissionNames.Pages_Profile_Education,PermissionNames.Pages_TutorApplications_Education)]
    public class UserEducationsAppService : AcademicallyAppServiceBase, IUserEducationsAppService
    {
        private readonly IRepository<UserEducation, Guid> _userEducationsRepository;
        private readonly IRepository<University, Guid> _universitesRepository;
        private readonly IRepository<UserEducationCourse, Guid> _userEducationCoursesRepository;
        private readonly IRepository<UserEducationDocument, Guid> _userEducationDocumentsRepository;
        private readonly IRepository<AcademicLevel, Guid> _academiclLevelsRepository;
        private readonly IRepository<AcademicLevelQualification, Guid> _academiclLevelQualificationsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public UserEducationsAppService(
            IRepository<UserEducation, Guid> userEducationsRepository,
            IRepository<University, Guid> universitesRepository,
            IRepository<UserEducationCourse, Guid> userEducationCoursesRepository,
            IRepository<UserEducationDocument, Guid> userEducationDocumentsRepository,
            IRepository<AcademicLevel, Guid> academiclLevelsRepository,
            IRepository<AcademicLevelQualification, Guid> academiclLevelQualificationsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _userEducationsRepository = userEducationsRepository;
            _universitesRepository = universitesRepository;
            _userEducationCoursesRepository = userEducationCoursesRepository;
            _userEducationDocumentsRepository = userEducationDocumentsRepository;
            _academiclLevelsRepository = academiclLevelsRepository;
            _academiclLevelQualificationsRepository = academiclLevelQualificationsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<IEnumerable<UniversityDto>> GetAll(long userId)
        {
            var userEducations = await _userEducationsRepository.GetAll()
                .Include(e => e.University)
                .Include(e => e.UserEducationCourses)
                    .ThenInclude(e => e.AcademicLevel)
                .Include(e => e.UserEducationCourses)
                    .ThenInclude(e => e.AcademicLevelQualification)
                .Include(e => e.UserEducationDocuments)
                    .ThenInclude(e => e.Document)
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.EndYear)
                    .ThenByDescending(e => e.StartYear)
                .ToListAsync();

            var userUniversities = userEducations.Select(e => ObjectMapper.Map<UniversityDto>(e.University))
                .GroupBy(e => e.Id)
                .Select(e => e.First())
                .ToList();

            foreach (var university in userUniversities)
            {
                university.UserEducations = userEducations.Where(e => e.UniversityId == university.Id)
                    .Select(e => ObjectMapper.Map<UserEducationDto>(e));
            }

            return userUniversities;
        }

        public async Task<IEnumerable<AcademicLevelDto>> GetAcademicLevels()
        {
            var academicLevels = await _academiclLevelsRepository.GetAll()
                .OrderBy(e => e.DisplayOrder)
                .Select(e => ObjectMapper.Map<AcademicLevelDto>(e))
                .ToListAsync();
            return academicLevels;
        }

        public async Task<IEnumerable<AcademicLevelQualificationDto>> GetQualifications(Guid academicLevelId)
        {
            var qualifications = await _academiclLevelQualificationsRepository.GetAll()
                .Where(e => e.AcademicLevelId == academicLevelId)
                .Where(e => e.ReviewStatus == AcademicLevelQualificationReviewStatus.Approved
                    || (e.ReviewStatus != AcademicLevelQualificationReviewStatus.Rejected && (e.CreatorUserId == AbpSession.UserId.Value
                    || e.CreatorUserId == null)))
                .OrderBy(e => e.DisplayOrder)
                .Select(e => ObjectMapper.Map<AcademicLevelQualificationDto>(e))
                .ToListAsync();
            return qualifications;
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Create)]
        public async Task<Guid> Create(CreateEditUserEducationDto input)
        {
            var university = await CreateAndGetUniverisityIfNotExists(input.UniversityName, input.UniversityCountryCode);
            var userEducaton = ObjectMapper.Map<UserEducation>(input);
            userEducaton.UniversityId = university.Id;
            userEducaton.UserId = AbpSession.UserId.Value;
            return await _userEducationsRepository.InsertAndGetIdAsync(userEducaton);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Update)]
        public async Task<Guid> Update(CreateEditUserEducationDto input)
        {
            var userEducationCourseInputs = input.UserEducationCourses;
            input.UserEducationCourses = null;

            var university = await CreateAndGetUniverisityIfNotExists(input.UniversityName, input.UniversityCountryCode);
            var userEducation = await _userEducationsRepository.GetAsync(input.Id.Value);
            ObjectMapper.Map(input, userEducation);
            userEducation.UniversityId = university.Id;

            var userEducationCourses = await _userEducationCoursesRepository.GetAll()
                .Where(e => e.UserEducationId == userEducation.Id)
                .ToListAsync();
            foreach (var userEducationCourseInput in userEducationCourseInputs)
            {
                var userEducationCourse = userEducationCourses.FirstOrDefault(e => e.Id == userEducationCourseInput.Id);
                if (userEducationCourse == null)
                {
                    userEducationCourse = new UserEducationCourse();
                }
                ObjectMapper.Map(userEducationCourseInput, userEducationCourse);
                userEducationCourse.UserEducationId = userEducation.Id;
                await _userEducationCoursesRepository.InsertOrUpdateAsync(userEducationCourse);
            }
            foreach (var userEducationCourse in userEducationCourses)
            {
                if (userEducationCourseInputs.FirstOrDefault(e => e.Id == userEducationCourse.Id) == null)
                {
                    await _userEducationCoursesRepository.DeleteAsync(userEducationCourse.Id);
                }
            }
            await _userEducationsRepository.UpdateAsync(userEducation);
            return userEducation.Id;
        }

        public async Task<AcademicLevelQualificationDto> SuggestionQualification(SuggestQualificationDto input)
        {
            var latestQualification = await _academiclLevelQualificationsRepository.GetAll()
                .Where(e => e.AcademicLevelId == input.AcademicLevelId)
                .OrderByDescending(e => e.DisplayOrder)
                .FirstOrDefaultAsync();
            var qualification = new AcademicLevelQualification();
            qualification.AcademicLevelId = input.AcademicLevelId;
            qualification.Name = input.Name;
            qualification.DisplayOrder = latestQualification.DisplayOrder + 1;
            qualification.ReviewStatus = AcademicLevelQualificationReviewStatus.Pending;
            await _academiclLevelQualificationsRepository.InsertAsync(qualification);
            return ObjectMapper.Map<AcademicLevelQualificationDto>(qualification);
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

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Delete)]
        public async Task Delete(Guid id)
        {
            var userEducationDocuments = await _userEducationDocumentsRepository.GetAll()
                .Where(e => e.UserEducationId == id)
                .ToListAsync();
            userEducationDocuments.ForEach(async e =>
            {
                await _documentsDomainService.DeleteAsync(e.DocumentId);
                await _userEducationDocumentsRepository.DeleteAsync(e.Id);
            });
            await _userEducationCoursesRepository.DeleteAsync(e => e.UserEducationId == id);
            await _userEducationsRepository.DeleteAsync(id);
        }

        [AbpAuthorize(PermissionNames.Pages_Profile_Education_Delete)]
        public async Task DeleteDocument(Guid userEducationDocumentId)
        {
            var userEducationDocument = await _userEducationDocumentsRepository.GetAsync(userEducationDocumentId);
            await _documentsDomainService.DeleteAsync(userEducationDocument.DocumentId);
            await _userEducationDocumentsRepository.DeleteAsync(userEducationDocument);
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
