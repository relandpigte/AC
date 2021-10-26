using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Projects.Dto
{
    [AutoMapTo(typeof(Project))]
    public class CreateProjectDto
    {
        public string Name { get; set; }

        public string Description { get; set; }
        public string AcademicLevel { get; set; }
        public string Qualification { get; set; }
        public string Methodology { get; set; }
        public string SubjectArea { get; set; }
        public string SubjectKeyWords { get; set; }
        public string UrgencyLevel { get; set; }
        public DateTime Deadline { get; set; }
        public bool IsPrivateRequest { get; set; }

        public Guid? ServiceLevel1 { get; set; }
        public string ServiceNameLevel1 { get; set; }

        public Guid? ServiceLevel2 { get; set; }
        public string ServiceNameLevel2 { get; set; }

        public Guid? ServiceLevel3 { get; set; }
        public string ServiceNameLevel3 { get; set; }
    }
}
