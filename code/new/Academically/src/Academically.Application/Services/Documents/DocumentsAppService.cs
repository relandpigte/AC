using System;
using System.Threading.Tasks;
using Academically.Domain.Entities;
using Academically.Domain.Services.Documents;
using Academically.Services.Documents.Dto;

namespace Academically.Services.Documents
{
    public class DocumentsAppService : AcademicallyAppServiceBase, IDocumentsAppService
    {
        private readonly IDocumentsDomainService _documentsDomainService;

        public DocumentsAppService(
            IDocumentsDomainService documentsDomainService
            )
        {
            _documentsDomainService = documentsDomainService;
        }

        public async Task<string> GetSecuredUrl(Guid id)
        {
            return await _documentsDomainService.GetFileUrlAsync(id);
        }

        public async Task<string> GetProfilePictureUrl(long userId)
        {
            var user = await UserManager.GetUserByIdAsync(userId);
            if (user.ProfilePictureDocumentId.HasValue)
            {
                return await GetSecuredUrl(user.ProfilePictureDocumentId.Value);
            }

            return String.Empty;
        }

        public async Task<DocumentDto> GetAsync(Guid id)
        {
            var document = await _documentsDomainService.GetAsync(id);
            return ObjectMapper.Map<DocumentDto>(document);
        }

        public async Task<DocumentDto> CreateAsync(DocumentDto input, Guid? referenceId)
        {
            input.CreatorUserId = AbpSession.UserId.Value;
            var document = ObjectMapper.Map<Document>(input);
            await _documentsDomainService.CreateAsync(document, referenceId);
            input.Id = document.Id;
            return input;
        }

        public async Task DeleteAsync(Guid id, Guid? referenceId)
        {
            await _documentsDomainService.DeleteReferenceAsync(id, referenceId);
        }
    }
}
