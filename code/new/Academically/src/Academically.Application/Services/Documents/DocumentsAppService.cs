using Abp.Configuration;
using Abp.Domain.Repositories;
using Academically.Configuration;
using Academically.Domain.Entities;
using SourceCloud.Core.Services;
using System;
using System.Threading.Tasks;

namespace Academically.Services.Documents
{
    public class DocumentsAppService : AcademicallyAppServiceBase, IDocumentsAppService
    {
        private readonly IRepository<Document, Guid> _documentsRepository;
        private readonly IFileManagerService _fileManagerService;
        private readonly ISettingManager _settingManager;

        public DocumentsAppService(
            IRepository<Document, Guid> documentsRepository,
            IFileManagerService fileManagerService,
            ISettingManager settingManager
            )
        {
            _documentsRepository = documentsRepository;
            _fileManagerService = fileManagerService;
            _settingManager = settingManager;
        }

        public async Task<string> GetSecuredUrl(Guid id)
        {
            var document = await _documentsRepository.GetAsync(id);
            string folder;
            bool isSecured;
            switch (document.DocumentType)
            {
                default:
                    folder = await _settingManager.GetSettingValueAsync(AppSettingNames.Aws_S3_Folders_Qualifications);
                    isSecured = true;
                    break;
            }
            string fileUrl = _fileManagerService.GetFileUrl(document.Name, AbpSession.UserId.Value, folder, isSecured);
            return fileUrl;
        }
    }
}
