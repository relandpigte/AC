using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Academically.Services.Posts.Dto;
using Abp.Domain.Entities.Auditing;

namespace Academically.Services.Posts.Dto
{
    [AutoMapFrom(typeof(PostTopic))]
    public class PostTopicDto : CreationAuditedEntity<Guid>
    {
        public Guid PostId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
        
       
    }
}
