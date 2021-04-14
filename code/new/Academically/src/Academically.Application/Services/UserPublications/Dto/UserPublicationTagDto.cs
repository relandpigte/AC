using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.UserPublications.Dto
{
    [AutoMap(typeof(UserPublicationTag))]
    public class UserPublicationTagDto : EntityDto<Guid>
    {
        public Guid UserPublicationId { get; set; }
        public Guid PublicationTagId { get; set; }

        public virtual PublicationTagDto PublicationTag { get; set; }
    }
}
