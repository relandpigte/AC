using System;
using System.Threading.Tasks;
using Abp.Domain.Services;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Academically.Domain.Services.Documents
{
    public interface IDocumentsDomainService : IDomainService
    {
        string GetBaseDirectory();
        Task<byte[]> GetFileDataAsync(Guid id);
        Task<string> GetFileUrlAsync(Document document);
        Task<string> GetFileUrlAsync(Guid id);
        Task<Document> GetAsync(Guid id);
        Task<Document> CreateAsync(long userId, IFormFile file, DocumentType documentType);
        Task CreateAsync(Document document, Guid? referenceId, IFormFile? file);
        Task DeleteAsync(Guid id);
        Task DeleteReferenceAsync(Guid id, Guid? referenceId);
    }
}
