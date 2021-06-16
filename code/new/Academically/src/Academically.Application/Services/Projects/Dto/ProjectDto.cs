using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;

namespace Academically.Services.Projects.Dto
{
    [AutoMap(typeof(Project))]
    public class ProjectDto : CreationAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public Guid? ServiceLevel1 { get; set; }
        public string ServiceNameLevel1 { get; set; }

        public Guid? ServiceLevel2 { get; set; }
        public string ServiceNameLevel2 { get; set; }

        public Guid? ServiceLevel3 { get; set; }
        public string ServiceNameLevel3 { get; set; }

        public UserDto CreatorUser { get; set; }
    }
}
