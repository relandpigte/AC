using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Extensions;
using Academically.Services.Ratings.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;
using Abp.Runtime.Session;
using ServiceRatingDto = Academically.Services.Ratings.Dto.ServiceRatingDto;

namespace Academically.Services.Ratings
{
    public class RatingsAppService : AcademicallyAppServiceBase, IRatingsAppService
    {
        private readonly IRepository<StudentRating, Guid> _studentRatingsRepository;
        private readonly IRepository<TutorRating, Guid> _tutorRatingsRepository;
        private readonly IRepository<TutorRatingArea, Guid> _tutorRatingAreasRepository;
        private readonly IRepository<CourseRating, Guid> _courseRatingsRepository;
        private readonly IRepository<CourseRatingArea, Guid> _courseRatingAreasRepository;
        private readonly IRepository<ServiceRating, Guid> _serviceRatingsRepository;
        private readonly IRepository<EventRating, Guid> _eventRatingsRepository;
        private readonly IRepository<ServiceRatingArea, Guid> _serviceRatingAreaRepository;

        public RatingsAppService(
            IRepository<StudentRating, Guid> studentRatingsRepository,
            IRepository<TutorRating, Guid> tutorRatingsRepository,
            IRepository<TutorRatingArea, Guid> tutorRatingAreasRepository,
            IRepository<CourseRating, Guid> courseRatingsRepository,
            IRepository<CourseRatingArea, Guid> courseRatingAreasRepository,
            IRepository<ServiceRating, Guid> serviceRatingsRepository,
            IRepository<EventRating, Guid> eventRatingsRepository,
            IRepository<ServiceRatingArea, Guid> serviceRatingAreaRepository
            )
        {
            _studentRatingsRepository = studentRatingsRepository;
            _tutorRatingsRepository = tutorRatingsRepository;
            _tutorRatingAreasRepository = tutorRatingAreasRepository;
            _courseRatingsRepository = courseRatingsRepository;
            _courseRatingAreasRepository = courseRatingAreasRepository;
            _serviceRatingsRepository = serviceRatingsRepository;
            _eventRatingsRepository = eventRatingsRepository;
            _serviceRatingAreaRepository = serviceRatingAreaRepository;
        }

        public async Task<EventRating> CreateEventRatings(CreateEventRatingsDto input)
        {
            var eventRating = ObjectMapper.Map<EventRating>(input);
            return await _eventRatingsRepository.InsertAsync(eventRating);
        }

        public async Task CreateServiceRatings(CreateServiceRatingDto input)
        {
            input.CreatorUserId = input.CreatorUserId == 0 ? AbpSession.UserId.Value : input.CreatorUserId;

            var serviceRating = ObjectMapper.Map<ServiceRating>(input);
            serviceRating.ServiceRatingAreas = input.ServiceRatingAreas
                .Select(a => ObjectMapper.Map<ServiceRatingArea>(a))
                .ToList();

            await _serviceRatingsRepository.InsertAsync(serviceRating);
        }

        public async Task<decimal> GetUserServiceReview(Guid serviceId)
        {
            var rating = await _serviceRatingsRepository.GetAll()
                .Include(s => s.ServiceRatingAreas)
                .Where(s => s.ServiceId == serviceId && s.CreatorUserId == AbpSession.GetUserId())
                .FirstOrDefaultAsync();

            if (rating == null) return 0;
            return rating.ServiceRatingAreas.Sum(s => s.Rating).ToDecimal() / 5;
        }

        public async Task<PagedResultDto<ServiceRatingDto>> GetServiceRatings(PagedServiceRatingRequestDto input)
        {
            var serviceRatings = await _serviceRatingsRepository.GetAll()
                .Include(s => s.ServiceRatingAreas)
                .Include(s => s.CreatorUser)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Where(s => s.ServiceId == input.ServiceId)
                .OrderByDescending(e => e.CreationTime)
                .PageBy(input)
                .Take(input.MaxResultCount)
                .ToListAsync();
            
            var outputs = new List<ServiceRatingDto>();
            foreach (var rating in serviceRatings)
            {
                var output = ObjectMapper.Map<ServiceRatingDto>(rating);
                output.TotalRatingPercentage = rating.ServiceRatingAreas.Sum(s => s.Rating).ToDecimal() / 5;
                outputs.Add(output);
            }
                
            return new PagedResultDto<ServiceRatingDto>(serviceRatings.Count, outputs);
        }

        public async Task<ServiceRatingSummaryDto> GetServiceRatingsSummary(Guid serviceId)
        {
            var serviceRatingsSummary = new ServiceRatingSummaryDto();
            var serviceRatingsQuery = _serviceRatingsRepository.GetAll()
                .Where(s => s.ServiceId == serviceId);

            serviceRatingsSummary.TotalReviews = await serviceRatingsQuery.CountAsync();
            if (serviceRatingsSummary.TotalReviews != 0)
            {
                serviceRatingsSummary.TotalNeutralReviews = await _serviceRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Neutral && e.ServiceId == serviceId);
                if (serviceRatingsSummary.TotalReviews != serviceRatingsSummary.TotalNeutralReviews)
                {
                    serviceRatingsSummary.TotalPositiveReviews = await _serviceRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive && e.ServiceId == serviceId);
                    serviceRatingsSummary.TotalNegativeReviews = await _serviceRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative && e.ServiceId == serviceId);
                    serviceRatingsSummary.PositivePercentage = serviceRatingsSummary.TotalPositiveReviews.ToDecimal() / (serviceRatingsSummary.TotalPositiveReviews.ToDecimal() + serviceRatingsSummary.TotalNegativeReviews.ToDecimal());
                    serviceRatingsSummary.PositivePercentage = Math.Round(serviceRatingsSummary.PositivePercentage * 100, 1);
                }
            }

            var serviceRatingAreasQuery = _serviceRatingAreaRepository.GetAll()
                .Where(e => e.ServiceRating.ServiceId == serviceId);
            serviceRatingsSummary.TotalCommunicationRatings = await GetTotalServiceRatingsOnArea(serviceRatingAreasQuery, RatingAreaType.Communication);
            serviceRatingsSummary.TotalValueForMoneyRatings = await GetTotalServiceRatingsOnArea(serviceRatingAreasQuery, RatingAreaType.ValueForMoney);
            serviceRatingsSummary.TotalPunctualityRatings = await GetTotalServiceRatingsOnArea(serviceRatingAreasQuery, RatingAreaType.Punctuality);
            serviceRatingsSummary.TotalProfessionalismsRating = await GetTotalServiceRatingsOnArea(serviceRatingAreasQuery, RatingAreaType.Professionalism);
            serviceRatingsSummary.TotalKnowledgeRatings = await GetTotalServiceRatingsOnArea(serviceRatingAreasQuery, RatingAreaType.Knowledge);
            serviceRatingsSummary.TotalRatingPercentage = Math.Round((serviceRatingsSummary.TotalCommunicationRatings + serviceRatingsSummary.TotalValueForMoneyRatings
                + serviceRatingsSummary.TotalPunctualityRatings + serviceRatingsSummary.TotalProfessionalismsRating + serviceRatingsSummary.TotalKnowledgeRatings) / 5, 1);

            return serviceRatingsSummary;
        }

        public async Task<StudentRatingSummaryDto> GetStudentRatingSummary(long studentId)
        {
            var studentRatingsQuery = _studentRatingsRepository.GetAll()
                .Where(e => e.StudentId == studentId);
            var studentRatingSummary = new StudentRatingSummaryDto()
            {
                TotalReviews = await studentRatingsQuery.CountAsync(),
            };
            if (studentRatingSummary.TotalReviews != 0)
            {
                studentRatingSummary.TotalNeutralReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Neutral);
                if (studentRatingSummary.TotalReviews != studentRatingSummary.TotalNeutralReviews)
                {
                    studentRatingSummary.TotalPositiveReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    studentRatingSummary.TotalNegativeReviews = await _studentRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);

                    studentRatingSummary.PositivePercentage = studentRatingSummary.TotalPositiveReviews.ToDecimal()
                        / (studentRatingSummary.TotalPositiveReviews.ToDecimal() + studentRatingSummary.TotalNegativeReviews.ToDecimal());
                    studentRatingSummary.PositivePercentage = Math.Round(studentRatingSummary.PositivePercentage * 100, 1);
                }
            }
            return studentRatingSummary;
        }

        public async Task<TutorRatingSummaryDto> GetTutorRatingSummary(long tutorId)
        {
            var tutorRatingsQuery = _tutorRatingsRepository.GetAll()
                .Where(e => e.TutorId == tutorId);
            var tutorRatingSummary = new TutorRatingSummaryDto()
            {
                TotalReviews = await tutorRatingsQuery.CountAsync(),
            };
            if (tutorRatingSummary.TotalReviews != 0)
            {
                tutorRatingSummary.TotalNeutralReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Neutral);
                if (tutorRatingSummary.TotalReviews != tutorRatingSummary.TotalNeutralReviews)
                {
                    tutorRatingSummary.TotalPositiveReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    tutorRatingSummary.TotalNegativeReviews = await _tutorRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);

                    tutorRatingSummary.PositivePercentage = tutorRatingSummary.TotalPositiveReviews.ToDecimal()
                        / (tutorRatingSummary.TotalPositiveReviews.ToDecimal() + tutorRatingSummary.TotalNegativeReviews.ToDecimal());
                    tutorRatingSummary.PositivePercentage = Math.Round(tutorRatingSummary.PositivePercentage * 100, 1);
                }
            }

            var tutorRatingAreasQuery = _tutorRatingAreasRepository.GetAll()
                .Where(e => e.TutorRating.TutorId == tutorId);
            tutorRatingSummary.TotalCommunicationRatings = await GetTotalTutorRatingsOnArea(tutorRatingAreasQuery, RatingAreaType.Communication);
            tutorRatingSummary.TotalValueForMoneyRatings = await GetTotalTutorRatingsOnArea(tutorRatingAreasQuery, RatingAreaType.ValueForMoney);
            tutorRatingSummary.TotalPunctualityRatings = await GetTotalTutorRatingsOnArea(tutorRatingAreasQuery, RatingAreaType.Punctuality);
            tutorRatingSummary.TotalProfessionalismsRating = await GetTotalTutorRatingsOnArea(tutorRatingAreasQuery, RatingAreaType.Professionalism);
            tutorRatingSummary.TotalKnowledgeRatings = await GetTotalTutorRatingsOnArea(tutorRatingAreasQuery, RatingAreaType.Knowledge);
            tutorRatingSummary.TotalRatingPercentage = Math.Round((tutorRatingSummary.TotalCommunicationRatings + tutorRatingSummary.TotalValueForMoneyRatings
                + tutorRatingSummary.TotalPunctualityRatings + tutorRatingSummary.TotalProfessionalismsRating + tutorRatingSummary.TotalKnowledgeRatings) / 5, 1);

            return tutorRatingSummary;
        }

        public async Task<PagedResultDto<StudentRatingDto>> GetStudentRatings(PagedStudentRatingRequestDto input)
        {
            var studentRatingsQuery = _studentRatingsRepository.GetAll()
                .Where(e => e.StudentId == input.StudentId);

            var totalCount = await studentRatingsQuery.CountAsync();

            studentRatingsQuery = studentRatingsQuery
                .Include(e => e.Reviewer)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Reviewer)
                    .ThenInclude(e => e.UserEducations)
                        .ThenInclude(e => e.University)
                .OrderByDescending(e => e.CreationTime);

            var studentRatings = await studentRatingsQuery
                .PageBy(input)
                .Take(input.MaxResultCount)
                .ToListAsync();

            var outputs = new List<StudentRatingDto>();
            foreach (var studentRating in studentRatings)
            {
                var output = ObjectMapper.Map<StudentRatingDto>(studentRating);
                if (studentRating.Reviewer.UserEducations != null && studentRating.Reviewer.UserEducations.Count > 0)
                {
                    output.Reviewer.CurrentUniversity = studentRating.Reviewer.UserEducations
                        .OrderByDescending(e => e.EndYear)
                            .ThenByDescending(e => e.StartYear)
                       .FirstOrDefault()
                       .University.HeProvider;
                }
                outputs.Add(output);
            }

            return new PagedResultDto<StudentRatingDto>(totalCount, outputs);
        }

        public async Task<PagedResultDto<TutorRatingDto>> GetTutorRatings(PagedTutorRatingRequestDto input)
        {
            var tutorRatingsQuery = _tutorRatingsRepository.GetAll()
                .Where(e => e.TutorId == input.TutorId);

            var totalCount = await tutorRatingsQuery.CountAsync();

            tutorRatingsQuery = tutorRatingsQuery
                .Include(e => e.Reviewer)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Reviewer)
                    .ThenInclude(e => e.UserEducations)
                        .ThenInclude(e => e.University)
                .OrderByDescending(e => e.CreationTime);

            var tutorRatings = await tutorRatingsQuery
                .PageBy(input)
                .Take(input.MaxResultCount)
                .ToListAsync();

            var outputs = new List<TutorRatingDto>();
            foreach (var tutorRating in tutorRatings)
            {
                var output = ObjectMapper.Map<TutorRatingDto>(tutorRating);
                output.TotalRatingPercentage = (await _tutorRatingAreasRepository.GetAll()
                    .Where(e => e.TutorRatingId == tutorRating.Id)
                    .SumAsync(e => e.Rating)).ToDecimal() / 5;
                if (tutorRating.Reviewer.UserEducations != null && tutorRating.Reviewer.UserEducations.Count > 0)
                {
                    output.Reviewer.CurrentUniversity = tutorRating.Reviewer.UserEducations
                        .OrderByDescending(e => e.EndYear)
                            .ThenByDescending(e => e.StartYear)
                       .FirstOrDefault()
                       .University.HeProvider;
                }
                outputs.Add(output);
            }

            return new PagedResultDto<TutorRatingDto>(totalCount, outputs);
        }

        public async Task<CourseRatingSummaryDto> GetCourseRatingSummary(Guid courseId)
        {
            var courseRatingsQuery = _courseRatingsRepository.GetAll()
                .Where(e => e.CourseId == courseId);
            var courseRatingSummary = new CourseRatingSummaryDto()
            {
                TotalReviews = await courseRatingsQuery.CountAsync(),
            };
            if (courseRatingSummary.TotalReviews != 0)
            {
                courseRatingSummary.TotalNeutralReviews = await _courseRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Neutral);
                if (courseRatingSummary.TotalReviews != courseRatingSummary.TotalNeutralReviews)
                {
                    courseRatingSummary.TotalPositiveReviews = await _courseRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Positive);
                    courseRatingSummary.TotalNegativeReviews = await _courseRatingsRepository.CountAsync(e => e.ExperienceType == RatingExperienceType.Negative);

                    courseRatingSummary.PositivePercentage = courseRatingSummary.TotalPositiveReviews.ToDecimal()
                        / (courseRatingSummary.TotalPositiveReviews.ToDecimal() + courseRatingSummary.TotalNegativeReviews.ToDecimal());
                    courseRatingSummary.PositivePercentage = Math.Round(courseRatingSummary.PositivePercentage * 100, 1);
                }
            }

            var courseRatingAreasQuery = _courseRatingAreasRepository.GetAll()
                .Where(e => e.CourseRating.CourseId == courseId);
            courseRatingSummary.TotalCommunicationRatings = await GetTotalCourseRatingsOnArea(courseRatingAreasQuery, RatingAreaType.Communication);
            courseRatingSummary.TotalValueForMoneyRatings = await GetTotalCourseRatingsOnArea(courseRatingAreasQuery, RatingAreaType.ValueForMoney);
            courseRatingSummary.TotalPunctualityRatings = await GetTotalCourseRatingsOnArea(courseRatingAreasQuery, RatingAreaType.Punctuality);
            courseRatingSummary.TotalProfessionalismsRating = await GetTotalCourseRatingsOnArea(courseRatingAreasQuery, RatingAreaType.Professionalism);
            courseRatingSummary.TotalKnowledgeRatings = await GetTotalCourseRatingsOnArea(courseRatingAreasQuery, RatingAreaType.Knowledge);
            courseRatingSummary.TotalRatingPercentage = Math.Round((courseRatingSummary.TotalCommunicationRatings + courseRatingSummary.TotalValueForMoneyRatings
                + courseRatingSummary.TotalPunctualityRatings + courseRatingSummary.TotalProfessionalismsRating + courseRatingSummary.TotalKnowledgeRatings) / 5, 1);

            return courseRatingSummary;
        }

        public async Task<PagedResultDto<CourseRatingDto>> GetCourseRatings(PagedCourseRatingRequestDto input)
        {
            var courseRatingsQuery = _courseRatingsRepository.GetAll()
                .Where(e => e.CourseId == input.CourseId);

            var totalCount = await courseRatingsQuery.CountAsync();

            courseRatingsQuery = courseRatingsQuery
                .Include(e => e.Reviewer)
                    .ThenInclude(e => e.ProfilePictureDocument)
                .Include(e => e.Reviewer)
                    .ThenInclude(e => e.UserEducations)
                        .ThenInclude(e => e.University)
                .OrderByDescending(e => e.CreationTime);

            var courseRatings = await courseRatingsQuery
                .PageBy(input)
                .Take(input.MaxResultCount)
                .ToListAsync();

            var outputs = new List<CourseRatingDto>();
            foreach (var courseRating in courseRatings)
            {
                var output = ObjectMapper.Map<CourseRatingDto>(courseRating);
                output.TotalRatingPercentage = (await _courseRatingAreasRepository.GetAll()
                    .Where(e => e.CourseRatingId == courseRating.Id)
                    .SumAsync(e => e.Rating)).ToDecimal() / 5;
                if (courseRating.Reviewer.UserEducations != null && courseRating.Reviewer.UserEducations.Count > 0)
                {
                    output.Reviewer.CurrentUniversity = courseRating.Reviewer.UserEducations
                        .OrderByDescending(e => e.EndYear)
                            .ThenByDescending(e => e.StartYear)
                       .FirstOrDefault()
                       .University.HeProvider;
                }
                outputs.Add(output);
            }

            return new PagedResultDto<CourseRatingDto>(totalCount, outputs);
        }

        private async Task<decimal> GetTotalTutorRatingsOnArea(IQueryable<TutorRatingArea> query, RatingAreaType areaType)
        {
            var sumOfAllRatingsForArea = 0;
            var sumOfAllRatingsByNRatingForArea = 0;
            for (int n = 1; n <= 5; n++)
            {
                var totalNRating = await query.Where(e => e.Rating == n && e.AreaType == areaType).CountAsync();
                var productOfStartRatingTotalByN = n * totalNRating;
                sumOfAllRatingsForArea += totalNRating;
                sumOfAllRatingsByNRatingForArea += productOfStartRatingTotalByN;
            }
            if (sumOfAllRatingsForArea == 0)
            {
                return 0;
            }
            return Math.Round(sumOfAllRatingsByNRatingForArea.ToDecimal() / sumOfAllRatingsForArea.ToDecimal(), 1);
        }

        private async Task<decimal> GetTotalCourseRatingsOnArea(IQueryable<CourseRatingArea> query, RatingAreaType areaType)
        {
            var sumOfAllRatingsForArea = 0;
            var sumOfAllRatingsByNRatingForArea = 0;
            for (int n = 1; n <= 5; n++)
            {
                var totalNRating = await query.Where(e => e.Rating == n && e.AreaType == areaType).CountAsync();
                var productOfStartRatingTotalByN = n * totalNRating;
                sumOfAllRatingsForArea += totalNRating;
                sumOfAllRatingsByNRatingForArea += productOfStartRatingTotalByN;
            }
            if (sumOfAllRatingsForArea == 0)
            {
                return 0;
            }
            return Math.Round(sumOfAllRatingsByNRatingForArea.ToDecimal() / sumOfAllRatingsForArea.ToDecimal(), 1);
        }

        private static async Task<decimal> GetTotalServiceRatingsOnArea(IQueryable<ServiceRatingArea> ratingAreas, RatingAreaType areaType)
        {
            var totalRatingAreas = await ratingAreas.CountAsync(r => r.AreaType == areaType);
            return totalRatingAreas == 0 ? 0 : Math.Round((await ratingAreas
                .Where(r => r.AreaType == areaType)
                .SumAsync(r => r.Rating)).ToDecimal() / totalRatingAreas, 1);
        }
    }
}
