using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using System;

namespace Academically.Services.UserPublications.Dto
{
    [AutoMap(typeof(PublicationTag))]
    public class PublicationTagDto : EntityDto<Guid>
    {
        public string Name { get; set; }
    }
}
