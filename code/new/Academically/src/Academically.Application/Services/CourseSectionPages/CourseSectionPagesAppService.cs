using System;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.CourseSectionPages.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Academically.Services.CourseSectionPages
{
    public class CourseSectionPagesAppService : AcademicallyAppServiceBase, ICourseSectionPagesAppService
    {
        private readonly IRepository<CourseSectionPage, Guid> _courseSectionPagesRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public CourseSectionPagesAppService(
            IRepository<CourseSectionPage, Guid> courseSectionPagesRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _courseSectionPagesRepository = courseSectionPagesRepository;
            _documentsDomainService = documentsDomainService;

        }

        public async Task<CourseSectionPageDto> Get(Guid courseSectionId)
        {

            var courseSectionPage = await _courseSectionPagesRepository.GetAll()
           .Where(e => e.CourseSectionId == courseSectionId)
           .Include(e => e.ImageDocument)
           .FirstOrDefaultAsync();

            var output = ObjectMapper.Map<CourseSectionPageDto>(courseSectionPage);

            if (courseSectionPage != null)
                output.CourseSectionPageImageUrl = await _documentsDomainService.GetFileUrlAsync(courseSectionPage.ImageDocument);

            return output;
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

        public async Task SaveUpdateDetails([FromForm] UpdateCourseSectionPageDto input)
        {
            CourseSectionPage courseSectionPage;
            var courseSectionImageDocument = new Document();
            var pageContent = string.Empty;

            if (input.Id.HasValue)
            {
                courseSectionPage = await _courseSectionPagesRepository.GetAll().FirstOrDefaultAsync(e => e.Id == input.Id);
                pageContent = courseSectionPage.PageContent;
                ObjectMapper.Map(input, courseSectionPage);
            }
            else
            {
                courseSectionPage = ObjectMapper.Map<CourseSectionPage>(input);
            }
            if (input.File != null)
            {
                courseSectionImageDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.File, DocumentType.CourseSectionPage);

                if (courseSectionPage != null)
                {

                    var oldDocumentId = courseSectionPage.ImageDocumentId;
                    if (oldDocumentId.HasValue)
                    {
                        await _documentsDomainService.DeleteAsync(oldDocumentId.Value);
                    }
                }
                courseSectionPage.ImageDocumentId = courseSectionImageDocument.Id;

            }
            courseSectionPage.CreatorUserId = AbpSession.UserId.Value;
            courseSectionPage.PageContent = pageContent;
            await _courseSectionPagesRepository.InsertOrUpdateAsync(courseSectionPage);
        }
    }
}
