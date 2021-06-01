using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;
using System;

namespace Academically.Services.DbsCertificates.Dto
{
    [AutoMapFrom(typeof(DbsCertificate))]
    public class DbsCertificateDto : EntityDto<Guid>
    {
        public string DbsNumber { get; set; }
        public DateTime DateOfIssue { get; set; }
        public Guid DocumentId { get; set; }

        public DocumentDto Document { get; set; }

        public string DbsCertificateFileUrl { get; set; }
    }
}
