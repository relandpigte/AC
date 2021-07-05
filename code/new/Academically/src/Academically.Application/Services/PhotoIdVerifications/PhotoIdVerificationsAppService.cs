using Abp.Domain.Repositories;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Domain.Services.Documents;
using Academically.Services.PhotoIdVerifications.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Academically.Services.PhotoIdVerifications
{
    public class PhotoIdVerificationsAppService : AcademicallyAppServiceBase, IPhotoIdVerificationsAppService
    {
        private readonly IRepository<PhotoIdVerification, Guid> _photoIdVerificationsRepository;
        private readonly IDocumentsDomainService _documentsDomainService;

        public PhotoIdVerificationsAppService(
            IRepository<PhotoIdVerification, Guid> photoIdVerificationsRepository,
            IDocumentsDomainService documentsDomainService
            )
        {
            _photoIdVerificationsRepository = photoIdVerificationsRepository;
            _documentsDomainService = documentsDomainService;
        }

        public async Task<PhotoIdVerificationDto> GetLatest(long userId)
        {
            var photoIdVerification = await _photoIdVerificationsRepository.GetAll()
                .Where(e => e.Status != PhotoIdVerificationStatus.Declined && e.CreatorUserId == userId)
                .OrderByDescending(e => e.CreationTime)
                .Include(e => e.Document)
                .FirstOrDefaultAsync();

            if (photoIdVerification == null)
            {
                return new PhotoIdVerificationDto();
            }

            var output = ObjectMapper.Map<PhotoIdVerificationDto>(photoIdVerification);
            output.PhotoIdUrl = await _documentsDomainService.GetFileUrlAsync(photoIdVerification.Document);

            return output;
        }

        public async Task Create([FromForm] CreatePhotoIdVerificationDto input)
        {
            var photoIdVerificationDocument = await _documentsDomainService.CreateAsync(AbpSession.UserId.Value, input.PhotoId, DocumentType.PhotoId);
            var photoIdVerification = new PhotoIdVerification();
            photoIdVerification.Status = PhotoIdVerificationStatus.Pending;
            photoIdVerification.DocumentId = photoIdVerificationDocument.Id;

            await _photoIdVerificationsRepository.InsertAsync(photoIdVerification);
        }
    }
}
