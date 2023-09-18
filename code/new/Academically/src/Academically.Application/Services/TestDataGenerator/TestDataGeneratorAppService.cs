using Abp.Authorization.Users;
using Abp.Domain.Repositories;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.TestDataGenerator.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.TestDataGenerator
{
    public class TestDataGeneratorAppService : AcademicallyAppServiceBase, ITestDataGeneratorAppService
    {
        private Random _randomizer;
        private readonly RoleManager _roleManager;
        private readonly IRepository<StudentRating, Guid> _studentRatingsRepository;
        private readonly IRepository<TutorRating, Guid> _tutorRatingsRepository;
        private readonly IRepository<TutorRatingArea, Guid> _tutorRatingAreasRepository;

        public TestDataGeneratorAppService(
            RoleManager roleManager,
            IRepository<StudentRating, Guid> studentRatingsRepository,
            IRepository<TutorRating, Guid> tutorRatingsRepository,
            IRepository<TutorRatingArea, Guid> tutorRatingAreasRepository
            )
        {
            _randomizer = new Random();
            _roleManager = roleManager;
            _studentRatingsRepository = studentRatingsRepository;
            _tutorRatingsRepository = tutorRatingsRepository;
            _tutorRatingAreasRepository = tutorRatingAreasRepository;
        }

        public async Task GenerateTestRatingsForStudent(long studentId, int numberOfRatings)
        {
            var tutors = await UserManager.GetUsersInRoleAsync(StaticRoleNames.Tenants.Tutor);
            for (int i = 0; i < numberOfRatings; i++)
            {
                var experienceType = (RatingExperienceType)_randomizer.Next(0, 3);
                if (experienceType != RatingExperienceType.Positive)
                {
                    experienceType = (RatingExperienceType)_randomizer.Next(0, 3);
                }
                var randomTutor = tutors[_randomizer.Next(0, tutors.Count)];
                var studentRating = new StudentRating()
                {
                    StudentId = studentId,
                    ExperienceType = experienceType,
                    Comments = GenerateRandomLoremIpsum(),
                    CreatorUserId = randomTutor.Id,
                    CreationTime = GenerateRandomDate(),
                };
                await _studentRatingsRepository.InsertAsync(studentRating);
            }
        }

        public async Task GenerateTestRatingsForTutor(long tutorId, int numberOfRatings)
        {
            var students = await UserManager.GetUsersInRoleAsync(StaticRoleNames.Tenants.Student);
            for (int i = 0; i < numberOfRatings; i++)
            {
                var experienceType = (RatingExperienceType)_randomizer.Next(0, 3);
                if (experienceType != RatingExperienceType.Positive)
                {
                    experienceType = (RatingExperienceType)_randomizer.Next(0, 3);
                }
                var randomStudent = students[_randomizer.Next(0, students.Count)];
                var tutorRating = new TutorRating()
                {
                    TutorId = tutorId,
                    ExperienceType = experienceType,
                    Comments = GenerateRandomLoremIpsum(),
                    CreatorUserId = randomStudent.Id,
                    CreationTime = GenerateRandomDate(),
                };
                var id = await _tutorRatingsRepository.InsertAndGetIdAsync(tutorRating);
                await GenerateTestRatingAreaForTutor(id, RatingAreaType.Communication, experienceType);
                await GenerateTestRatingAreaForTutor(id, RatingAreaType.ValueForMoney, experienceType);
                await GenerateTestRatingAreaForTutor(id, RatingAreaType.Punctuality, experienceType);
                await GenerateTestRatingAreaForTutor(id, RatingAreaType.Professionalism, experienceType);
                await GenerateTestRatingAreaForTutor(id, RatingAreaType.Knowledge, experienceType);
            }
        }

        public async Task GenerateTestUsers()
        {
            await GenerateTestUser("Tutor 1", "Dev", "dev+tutor1@mailinator.com", "P@$$w0rd", StaticRoleNames.Tenants.Tutor);
            await GenerateTestUser("Student 1", "Dev", "dev+student1@mailinator.com", "P@$$w0rd", StaticRoleNames.Tenants.Student);
            await GenerateTestUser("Student 2", "Dev", "dev+student2@mailinator.com", "P@$$w0rd", StaticRoleNames.Tenants.Student);
            await GenerateTestUser("Student 3", "Dev", "dev+student3@mailinator.com", "P@$$w0rd", StaticRoleNames.Tenants.Student);
        }

        private async Task GenerateTestRatingAreaForTutor(Guid tutorRatingId, RatingAreaType areaType, RatingExperienceType experienceType)
        {
            int ratingStart;
            int ratingEnd;
            switch (experienceType)
            {
                case RatingExperienceType.Positive:
                    ratingStart = 4;
                    ratingEnd = 6;
                    break;
                case RatingExperienceType.Neutral:
                    ratingStart = 2;
                    ratingEnd = 5;
                    break;
                default:
                    ratingStart = 1;
                    ratingEnd = 3;
                    break;
            }
            var rating = _randomizer.Next(ratingStart, ratingEnd);
            var tutorRatingArea = new TutorRatingArea()
            {
                TutorRatingId = tutorRatingId,
                AreaType = areaType,
                Rating = rating,
            };
            await _tutorRatingAreasRepository.InsertAsync(tutorRatingArea);
        }

        private async Task GenerateTestUser(string firstName, string lastName, string email, string password, string roleName)
        {
            var user = new User()
            {
                Name = firstName,
                Surname = lastName,
                EmailAddress = email,
                IsActive = true,
                UserName = email,
                IsEmailConfirmed = true,
                DateOfBirth = GenerateRandomDate(),
                About = GenerateRandomLoremIpsum(isHtml: false),

                Roles = new List<UserRole>()
            };

            var role = await _roleManager.GetRoleByNameAsync(roleName);
            user.Roles.Add(new UserRole(null, user.Id, role.Id));

            await UserManager.InitializeOptionsAsync(null);
            CheckErrors(await UserManager.CreateAsync(user, password));
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        private DateTime GenerateRandomDate()
        {
            DateTime start = new DateTime(2010, 1, 1);
            int range = (DateTime.Today - start).Days;
            return start.AddDays(_randomizer.Next(range));
        }

        private string GenerateRandomLoremIpsum(int minWords = 5, int maxWords = 20, int minSentences = 2, int maxSentences = 10, bool isHtml = true)
        {
            int numParagraphs = _randomizer.Next(1, 5);
            var words = new[]{"lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
                "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod",
                "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat"};

            var rand = new Random();
            int numSentences = rand.Next(maxSentences - minSentences) + minSentences + 1;
            int numWords = rand.Next(maxWords - minWords) + minWords + 1;

            StringBuilder result = new StringBuilder();

            for (int p = 0; p < numParagraphs; p++)
            {
                if (isHtml)
                {
                    result.Append("<p>");
                }
                for (int s = 0; s < numSentences; s++)
                {
                    for (int w = 0; w < numWords; w++)
                    {
                        if (w > 0) { result.Append(" "); }
                        result.Append(words[rand.Next(words.Length)]);
                    }
                    result.Append(". ");
                }
                if (isHtml)
                {
                    result.Append("</p>");
                }
            }

            if (isHtml)
            {
                result.Append("<p>");
                result.Append("_generated.test.data_");
                result.Append("</p>");
            }
            else
            {
                result.Append("_generated.test.data_");
            }
            return result.ToString();
        }

        public async Task<TestDto> ExposeHubEvent()
        {
            return new TestDto();
        }
    }
}
