using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Services.CourseSectionPages.Dto;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseSectionPages
{
    public class CourseSectionPagesAppService : AcademicallyAppServiceBase, ICourseSectionPagesAppService
    {
        private readonly IRepository<CourseSectionPage, Guid> _courseSectionPagesRepository;

        public CourseSectionPagesAppService(
            IRepository<CourseSectionPage, Guid> courseSectionPagesRepository
            )
        {
            _courseSectionPagesRepository = courseSectionPagesRepository;
        }

        public async Task<CourseSectionPageDto> Get(Guid courseSectionId)
        {
            return await _courseSectionPagesRepository.GetAll()
                .Where(e => e.CourseSectionId == courseSectionId)
                .Select(e => ObjectMapper.Map<CourseSectionPageDto>(e))
                .FirstOrDefaultAsync();
        }

        public async Task Save(CourseSectionPageDto input)
        {
            CourseSectionPage courseSectionPage;
            if (input.Id.HasValue)
            {
                courseSectionPage = await _courseSectionPagesRepository.GetAsync(input.Id.Value);
                ObjectMapper.Map(input, courseSectionPage);
            }
            else
            {
                courseSectionPage = ObjectMapper.Map<CourseSectionPage>(input);
            }
            await _courseSectionPagesRepository.InsertOrUpdateAsync(courseSectionPage);
        }
    }
}
