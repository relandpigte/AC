using Abp.Application.Services;
using Academically.Services.Documents.Dto;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Documents
{
    public interface IDocumentsAppService : IApplicationService
    {
        Task<string> GetSecuredUrl(Guid id);
        Task<string> GetProfilePictureUrl(long userId);
        Task<DocumentDto> GetAsync(Guid id);
        Task<DocumentDto> CreateAsync(DocumentDto input, Guid? referenceId);
        Task DeleteAsync(Guid id, Guid? referenceId);
    }
}
