using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Documents.Dto
{
    [AutoMap(typeof(Document))]
    public class DocumentDto : EntityDto<Guid?>
    {
        public string Name { get; set; }
        public string OriginalFileName { get; set; }
        public string FileType { get; set; }
        public DocumentType DocumentType { get; set; }
        public long Size { get; set; }
    }
}
