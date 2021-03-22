using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.UserQualifications.Dto
{
    [AutoMap(typeof(UserQualificationDocument))]
    public class UserQualificationDocumentDto : EntityDto<Guid?>
    {
        public Guid UserQualificationId { get; set; }
        public Guid DocumentId { get; set; }
        public bool IsReviewed { get; set; }
    }
}
