using Abp.Authorization;
using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Timing;
using Abp.UI;
using Academically.Authorization;
using Academically.Authorization.Roles;
using Academically.Authorization.Users;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Extensions;
using Academically.Services.Profiles.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Runtime.Session;
using Academically.Services.Courses;
using Academically.Services.Ratings;
using Academically.Services.Services.Dto;
using Academically.Services.UserFollowers;
using Academically.Application.Shared.Services;
using Academically.Application.Shared.Dto;

namespace Academically.Services.Profiles
{
    [AbpAuthorize(PermissionNames.Pages_Profile, PermissionNames.Pages_TutorApplications_ProfilePicture)]
    public class ProfilesAppService : AcademicallyAppServiceBase, IProfilesAppService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<User, long> _usersRepository;
        private readonly IRepository<UserEducationCourse, Guid> _userEducationCoursesRepository;
        private readonly IRepository<StudentRating, Guid> _studentRatingsRepository;
        private readonly IRepository<TutorRating, Guid> _tutorRatingsRepository;
        private readonly IRepository<PassportVerification, Guid> _passportVerifications;
        private readonly IDocumentsDomainService _documentsDomainService;
        private readonly ILocationsService _locationsService;
        private readonly ISettingManager _settingManager;
        private readonly IUserFollowersAppService _userFollowersAppService;
        private readonly ICoursesAppService _coursesAppService;

        private readonly IRatingsAppService _ratingsAppService;
        private readonly IRepository<ServicePurchase, Guid> _servicePurchasesRepository;
        
        private readonly IRepository<Coaching, Guid> _coachingRepository;
        private readonly IRepository<Course, Guid> _courseRepository;
        private readonly IRepository<Article, Guid> _articleRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Video, Guid> _videoRepository;

        public ProfilesAppService(
            UserManager userManager,
            IRepository<User, long> usersRepository,
            IRepository<UserEducationCourse, Guid> userEducationCoursesRepository,
            IRepository<StudentRating, Guid> studentRatingsRepository,
            IRepository<TutorRating, Guid> tutorRatingsRepository,
            IRepository<PassportVerification, Guid> passportVerifications,
            IDocumentsDomainService documentsDomainService,
            ILocationsService locationsService,
            ISettingManager settingManager,
            IUserFollowersAppService userFollowersAppService,
            ICoursesAppService coursesAppService,
            IRepository<ServicePurchase, Guid> servicePurchasesRepository,
            IRatingsAppService ratingsAppService,
            
            IRepository<Coaching, Guid> coachingRepository,
            IRepository<Course, Guid> courseRepository,
            IRepository<Article, Guid> articleRepository,
            IRepository<Event, Guid> eventRepository,
            IRepository<Video, Guid> videoRepository)
        {
            _userManager = userManager;
            _usersRepository = usersRepository;
            _userEducationCoursesRepository = userEducationCoursesRepository;
            _studentRatingsRepository = studentRatingsRepository;
            _tutorRatingsRepository = tutorRatingsRepository;
            _passportVerifications = passportVerifications;
            _documentsDomainService = documentsDomainService;
            _locationsService = locationsService;
            _settingManager = settingManager;
            _userFollowersAppService = userFollowersAppService;
            _coursesAppService = coursesAppService;
            _servicePurchasesRepository = servicePurchasesRepository;
            _ratingsAppService = ratingsAppService;

            _coachingRepository = coachingRepository;
            _courseRepository = courseRepository;
            _articleRepository = articleRepository;
            _eventRepository = eventRepository;
            _videoRepository = videoRepository;
        }

        public async Task<UserDto> Get(long id)
        {
            var user = await _usersRepository.GetAll()
                .Include(e => e.CoverPhotoDocument)
                .Include(e => e.ProfilePictureDocument)
                .Include(e => e.IntroVideoDocument)
                .Include(e => e.Roles)
                .Include(e => e.UserEducations)
                    .ThenInclude(e => e.University)
                .FirstOrDefaultAsync(e => e.Id == id);
            var output = ObjectMapper.Map<UserDto>(user);
            output.RoleNames = await _userManager.GetRolesAsync(user);

            if (user.CoverPhotoDocumentId.HasValue)
            {
                output.CoverPhotoUrl = await _documentsDomainService.GetFileUrlAsync(user.CoverPhotoDocument);
            }
            if (user.ProfilePictureDocumentId.HasValue)
            {
                output.ProfilePictureUrl = await _documentsDomainService.GetFileUrlAsync(user.ProfilePictureDocument);
            }
            if (user.IntroVideoDocumentId.HasValue)
            {
                output.IntroVideoUrl = await _documentsDomainService.GetFileUrlAsync(user.IntroVideoDocument);
            }
            if (user.UserEducations != null && user.UserEducations.Count > 0)
            {
                var education = user.UserEducations
                    .OrderByDescending(e => e.EndYear)
                        .ThenByDescending(e => e.StartYear)
                   .FirstOrDefault();

                if (education != null)
                {
                    output.CurrentUniversity = education.University.HeProvider;
                    output.IsPresentUniversity = education.EndYear.ToLower() == "present";
                }
            }
            output.TimeZoneId = await _settingManager.GetSettingValueAsync(TimingSettingNames.TimeZone);

            return output;
        }

        public async Task<VerificationStatusDto> GetVerificationStatus(long id)
        {
            var user = await _usersRepository.GetAsync(id);
            var passportVerification = await _passportVerifications
                .GetAll()
                .OrderByDescending(e => e.CreationTime)
                .FirstOrDefaultAsync(e => e.CreatorUserId == AbpSession.UserId.Value);

            var verificationStatus = new VerificationStatusDto()
            {
                IsEmailConfirmed = user.IsEmailConfirmed,
                IsPhoneNumberConfirmed = user.IsPhoneNumberConfirmed,
                PassportVerificationStatus = passportVerification == null
                    ? PassportVerificationStatus.None
                    : passportVerification.Status,
            };

            return verificationStatus;
        }

        public async Task<ProfileMetricDto> GetMetrics(long id)
        {
            // TODO: Replace static values with proper datta
            // once the schemas are defined for each metric
            var profileMetric = new ProfileMetricDto()
            {
                TotalHours = 521,
                TotalHoursChange = "+3.5%",
                UserType = "Researcher",
            };

            var user = await UserManager.GetUserByIdAsync(id);

            var highestAcademicLevel = await _userEducationCoursesRepository.GetAll()
                .Where(e => e.UserEducation.UserId == id)
                .OrderByDescending(e => e.AcademicLevel.DisplayOrder)
                .Select(e => e.AcademicLevel)
                .FirstOrDefaultAsync();
            if (highestAcademicLevel != null)
            {
                profileMetric.AcademicLevel = highestAcademicLevel.Name;
            }

            int totalPositiveReviews = 0;
            int totalNegativeReviews = 0;
            if (await UserManager.IsInRoleAsync(user, StaticRoleNames.Tenants.Tutor))
            {
                var tutorRatingsQuery = _tutorRatingsRepository.GetAll()
                    .Where(e => e.TutorId == id);
                profileMetric.TotalReviews = await tutorRatingsQuery.CountAsync();
                if (profileMetric.TotalReviews > 0)
                {
                    totalPositiveReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    totalNegativeReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);
                }
            }
            else
            {
                var studentRatingsQuery = _studentRatingsRepository.GetAll()
                    .Where(e => e.StudentId == id);
                profileMetric.TotalReviews = await studentRatingsQuery.CountAsync();
                if (profileMetric.TotalReviews > 0)
                {
                    totalPositiveReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    totalNegativeReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);
                }
            }
            if (totalPositiveReviews > 0 || totalNegativeReviews > 0)
            {
                profileMetric.PositiveReviewsPercentage = Math.Round(totalPositiveReviews.ToDecimal()
                    / (totalPositiveReviews.ToDecimal() + totalNegativeReviews.ToDecimal()) * 100, 1);
            }

            return profileMetric;
        }

        public async Task<IEnumerable<LocationSuggestion>> GetLocationSuggestions(string keyword)
        {
            return await _locationsService.GetSuggestions(keyword);
        }

        public async Task<LocationDetail> GetLocation(string id)
        {
            return await _locationsService.Get(id);
        }

        public async Task Update(UserDto input)
        {
            var userId = AbpSession.UserId.Value;
            var existingUser = await _usersRepository.GetAll()
                .Where(e => e.Id != AbpSession.UserId.Value && (e.UserName == input.EmailAddress || e.EmailAddress == input.EmailAddress))
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                throw new UserFriendlyException(L("UserExistsErrorTitle"), L("UserExistsErrorMessage"));
            }

            var user = await _usersRepository.GetAsync(userId);
            ObjectMapper.Map(input, user);

            user.ProfilePictureDocument = null;
            user.UserName = user.EmailAddress;
            await _usersRepository.InsertOrUpdateAsync(user);

            if (!input.TimeZoneId.IsNullOrWhiteSpace())
            {
                await _settingManager.ChangeSettingForUserAsync(user.ToUserIdentifier(), TimingSettingNames.TimeZone, input.TimeZoneId);
            }
        }

        [AbpAllowAnonymous]
        public async Task UpdateProfileAsync(UpdateProfileDto input)
        {
            var userId = AbpSession.UserId.Value;
            var existingUser = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            existingUser.Name = input.FirstName;
            existingUser.Surname = input.LastName;
            await _usersRepository.UpdateAsync(existingUser);
        }

        public async Task UpdateWebsiteUrl(string websiteUrl)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.WebsiteUrl = websiteUrl;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task UpdateAbout(string about)
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.About = about;
            await _usersRepository.UpdateAsync(user);
        }

        public async Task<string> UpdateCoverPhoto([FromForm] UpdateCoverPhotoRequestDto input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            var previousCoverPhotoDocumentId = user.CoverPhotoDocumentId;
            var coverPhotoDocument = await _documentsDomainService.CreateAsync(user.Id, input.CoverPhoto, DocumentType.CoverPhoto);
            user.CoverPhotoDocumentId = coverPhotoDocument.Id;

            if (previousCoverPhotoDocumentId.HasValue)
            {
                await _documentsDomainService.DeleteAsync(previousCoverPhotoDocumentId.Value);
            }

            await _usersRepository.UpdateAsync(user);
            return await _documentsDomainService.GetFileUrlAsync(coverPhotoDocument);
        }

        public async Task<string> UpdateProfilePicture([FromForm] UpdateProfilePictureRequestDto input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            var previousProfilePictureDocumentId = user.ProfilePictureDocumentId;
            var profilePictureDocument = await _documentsDomainService.CreateAsync(user.Id, input.ProfilePicture, DocumentType.ProfilePicture);
            user.ProfilePictureDocumentId = profilePictureDocument.Id;

            if (previousProfilePictureDocumentId.HasValue)
            {
                await _documentsDomainService.DeleteAsync(previousProfilePictureDocumentId.Value);
            }

            await _usersRepository.UpdateAsync(user);
            return await _documentsDomainService.GetFileUrlAsync(profilePictureDocument);
        }

        public async Task<string> UpdateIntroVideo([FromForm] UpdateIntroVideoRequestDto input)
        {
            long userId = AbpSession.UserId.Value;
            var user = await _usersRepository.GetAsync(userId);
            var previousIntroVideoDocumentId = user.IntroVideoDocumentId;
            var introVideoDocument = await _documentsDomainService.CreateAsync(user.Id, input.IntroVideo, DocumentType.IntroVideo);
            user.IntroVideoDocumentId = introVideoDocument.Id;

            if (previousIntroVideoDocumentId.HasValue)
            {
                await _documentsDomainService.DeleteAsync(previousIntroVideoDocumentId.Value);
            }

            await _usersRepository.UpdateAsync(user);
            return await _documentsDomainService.GetFileUrlAsync(introVideoDocument);
        }

        public async Task DeleteCoverPhoto()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            if (user.CoverPhotoDocumentId.HasValue)
            {
                var previousCoverPhotoDocumentId = user.CoverPhotoDocumentId.Value;
                user.CoverPhotoDocumentId = null;
                await _usersRepository.UpdateAsync(user);
                await _documentsDomainService.DeleteAsync(previousCoverPhotoDocumentId);
            }
        }

        public async Task DeleteProfilePicture()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            if (user.ProfilePictureDocumentId.HasValue)
            {
                var previousProfilePictureDocumentId = user.ProfilePictureDocumentId.Value;
                user.ProfilePictureDocumentId = null;
                await _usersRepository.UpdateAsync(user);
                await _documentsDomainService.DeleteAsync(previousProfilePictureDocumentId);
            }
        }

        public async Task DeleteIntroVideo()
        {
            var user = await UserManager.GetUserByIdAsync(AbpSession.UserId.Value);
            if (user.IntroVideoDocumentId.HasValue)
            {
                var previousIntroVideoDocumentId = user.IntroVideoDocumentId.Value;
                user.IntroVideoDocumentId = null;
                await _usersRepository.UpdateAsync(user);
                await _documentsDomainService.DeleteAsync(previousIntroVideoDocumentId);
            }
        }

        [UnitOfWork(IsDisabled = true)]
        public async Task DeleteAccount()
        {
            var user = await _usersRepository.GetAsync(AbpSession.UserId.Value);
            user.DeleteDate = Clock.Now.AddDays(7);
            await _usersRepository.UpdateAsync(user);
            await _usersRepository.DeleteAsync(AbpSession.UserId.Value);
        }

        public async Task<LearnerProfileMetricDto> GetLearnerMetrics()
        {
            // TODO: Service course is only available for now.
            var coursesEnrolled = _coursesAppService.GetEnrolledCoursesByUser().Result.Count();
            var coursesCompleted = _coursesAppService.GetEnrolledCoursesByUser().Result.Count(c => c.Progress == 100);
            
            var servicePurchased = await _servicePurchasesRepository.CountAsync(s => s.CreatorUserId == AbpSession.GetUserId());
            var serviceCompleted = coursesCompleted;
            var totalFollowers = _userFollowersAppService.GetFollowers().Result.Count();

            return new LearnerProfileMetricDto
            {
                ServiceCompleted = serviceCompleted,
                ServicePurchased = servicePurchased,
                TotalFollowers = totalFollowers
            };
        }

        public async Task<TutorProfileMetricDto> GetTutorMetrics(long? userId)
        {
            var currentUserId = userId ?? AbpSession.GetUserId();
            var tutorRatings = await _ratingsAppService.GetTutorRatingSummary(currentUserId);
            
            var coachings = await _coachingRepository.GetAllListAsync(x => x.CreatorUserId == currentUserId);
            var courses = await _courseRepository.GetAllListAsync(x => x.CreatorUserId == currentUserId);
            var articles = await _articleRepository.GetAllListAsync(x => x.CreatorUserId == currentUserId);
            var events = await _eventRepository.GetAllListAsync(x => x.CreatorUserId == currentUserId);
            var videos = await _videoRepository.GetAllListAsync(x => x.CreatorUserId == currentUserId);

            var servicePurchasedByUsers = await _servicePurchasesRepository.GetAll()
                .Where(s => s.OwnerId == currentUserId)
                .Select(s => ObjectMapper.Map<ServicePurchaseDto>(s))
                .ToListAsync();

            decimal totalRevenue = 0;
            foreach (var service in servicePurchasedByUsers)
            {
                totalRevenue += await GetTotalRevenue(service);
            }

            return new TutorProfileMetricDto
            {
                Followers = _userFollowersAppService.GetFollowers().Result.Count(),
                ServiceCreated = coachings.Count + courses.Count + articles.Count + events.Count + videos.Count,
                PositiveReviews = tutorRatings.PositivePercentage,
                TotalReviews = tutorRatings.TotalReviews,
                TotalRevenue = Math.Round(totalRevenue, 1)
            };
        }

        public async Task<IEnumerable<UserDto>> GetAllStudentsByOwnerId(long? userId)
        {
            var currentUserId = userId ?? AbpSession.GetUserId();
            var studentPurchased = await _servicePurchasesRepository.GetAll()
                .Where(s => s.OwnerId == currentUserId && s.CreatorUserId != currentUserId)
                .Select(s => s.CreatorUserId)
                .Distinct()
                .ToListAsync();

            return await _usersRepository.GetAll()
                .Include(u => u.ProfilePictureDocument)
                .Where(u => studentPurchased.Contains(u.Id))
                .Select(u => ObjectMapper.Map<UserDto>(u))
                .ToListAsync();
        }

        private async Task<decimal> GetTotalRevenue(ServicePurchaseDto input)
        {
            decimal price = 0;
            switch (input.Type)
            {
                case ServicesType.Article:
                    var articles = await _articleRepository.FirstOrDefaultAsync(x => input.ReferenceId == x.Id);
                    price += articles.Price;
                    break;
                case ServicesType.Coaching:
                    var coachings = await _coachingRepository.FirstOrDefaultAsync(x => input.ReferenceId == x.Id);
                    if (coachings.Price.HasValue)
                    {
                        price += coachings.Price.Value;
                    }
                    break;
                case ServicesType.Course:
                    var courses = await _courseRepository.FirstOrDefaultAsync(x => input.ReferenceId == x.Id);
                    price += courses.Price;
                    break;
                case ServicesType.Event:
                    var events = await _eventRepository.FirstOrDefaultAsync(x => input.ReferenceId == x.Id);
                    if (events.Price.HasValue)
                    {
                        price += events.Price.Value;
                    }
                    break;
                case ServicesType.Tutorial:
                    var tutorials = await _videoRepository.FirstOrDefaultAsync(x => input.ReferenceId == x.Id);
                    if (tutorials.Price.HasValue)
                    {
                        price += tutorials.Price.Value;
                    }
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return price;
        }

        public async Task<List<decimal>> GetWeeklyRevenue()
        {
            var result = new List<decimal>();
            var startDate = DateTime.Today.AddDays(-1 * (int)DateTime.Today.DayOfWeek);
            foreach (var day in EachDay(startDate, startDate.AddDays(6)))
            {
                var servicePurchasedByUsers = await _servicePurchasesRepository.GetAll()
                    .Where(s => s.OwnerId == AbpSession.GetUserId())
                    .Where(s => s.CreationTime.Date == day.Date)
                    .Select(s => ObjectMapper.Map<ServicePurchaseDto>(s))
                    .ToListAsync();
                
                decimal totalRevenue = 0;
                foreach (var service in servicePurchasedByUsers)
                {
                    totalRevenue += await GetTotalRevenue(service);
                }

                result.Add(totalRevenue);
            }

            return result;
        }

        public async Task<List<decimal>> GetMonthlyRevenue()
        {
            var result = new List<decimal>();
        
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            foreach (var day in EachDay(startDate, endDate))
            {
                var servicePurchasedByUsers = await _servicePurchasesRepository.GetAll()
                    .Where(s => s.OwnerId == AbpSession.GetUserId())
                    .Where(s => s.CreationTime.Day == day.Day)
                    .Select(s => ObjectMapper.Map<ServicePurchaseDto>(s))
                    .ToListAsync();

                decimal totalRevenue = 0;
                foreach (var service in servicePurchasedByUsers)
                {
                    totalRevenue += await GetTotalRevenue(service);
                }
                
                result.Add(totalRevenue);
            }

            var final = new List<decimal>();
            for (var i = 0; i <= result.Count; i++)
            {
                if (i % 3 == 0)
                {
                    final.Add(result[i]);
                }
            }
            return final;
        }
        
        public async Task<List<decimal>> GetAnnualRevenue()
        {
            var result = new List<decimal>();
            var currentYear = DateTime.Now.Year;

            for (var month = 1; month <= 12; month++)
            {
                var currentDate = new DateTime(currentYear, month, 1);
                var servicePurchasedByUsers = await _servicePurchasesRepository.GetAll()
                    .Where(s => s.OwnerId == AbpSession.GetUserId())
                    .Where(s => s.CreationTime.Month == currentDate.Month)
                    .Select(s => ObjectMapper.Map<ServicePurchaseDto>(s))
                    .ToListAsync();

                decimal totalRevenue = 0;
                foreach (var service in servicePurchasedByUsers)
                {
                    totalRevenue += await GetTotalRevenue(service);
                }
                
                result.Add(totalRevenue);
            }
            return result;
        }
        
        private static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for(var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
    }
}
