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
using Academically.Services.DisciplineTaxonomies.Dto;

namespace Academically.Services.Courses.Dto
{
    [AutoMapFrom(typeof(CourseTopic))]
    public class CourseTopicDto : CreationAuditedEntity<Guid>
    {
        public Guid CourseId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }
        public DisciplineTaxonomyDto DisciplineTaxonomy { get; set; }
    }
}
