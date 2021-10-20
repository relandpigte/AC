using System;
using System.Threading.Tasks;
using Academically.Domain.Services.Documents;

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
    }
}
