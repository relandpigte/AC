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
using System.Threading.Tasks;

namespace Academically.Services.Ratings
{
    public class RatingsAppService : AcademicallyAppServiceBase, IRatingsAppService
    {
        private readonly IRepository<StudentRating, Guid> _studentRatingsRepository;
        private readonly IRepository<TutorRating, Guid> _tutorRatingsRepository;
        private readonly IRepository<TutorRatingArea, Guid> _tutorRatingAreasRepository;

        public RatingsAppService(
            IRepository<StudentRating, Guid> studentRatingsRepository,
            IRepository<TutorRating, Guid> tutorRatingsRepository,
            IRepository<TutorRatingArea, Guid> tutorRatingAreasRepository
            )
        {
            _studentRatingsRepository = studentRatingsRepository;
            _tutorRatingsRepository = tutorRatingsRepository;
            _tutorRatingAreasRepository = tutorRatingAreasRepository;
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
    }
}
