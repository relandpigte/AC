using Abp.Application.Services;
using Academically.Services.Documents.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Documents
{
    public interface IDocumentsAppService : IApplicationService
    {
        Task<string> DownloadAsync(Guid id);
        Task<string> GetSecuredUrl(Guid id);
        Task<string> GetProfilePictureUrl(long userId);
        Task<DocumentDto> GetAsync(Guid id);
        Task<DocumentDto> CreateAsync(CreateDocumentDto input);
        Task DeleteAsync(Guid id, Guid? referenceId);
    }
}
