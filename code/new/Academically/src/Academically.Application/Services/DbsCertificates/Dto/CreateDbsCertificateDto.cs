using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System;

namespace Academically.Services.DbsCertificates.Dto
{
    [AutoMapTo(typeof(DbsCertificate))]
    public class CreateDbsCertificateDto
    {
        public string DbsNumber { get; set; }
        public DateTime DateOfIssue { get; set; }

        public IFormFile File { get; set; }
    }
}
