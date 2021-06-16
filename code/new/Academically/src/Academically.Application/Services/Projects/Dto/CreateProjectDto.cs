using System;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Projects.Dto
{
    [AutoMapTo(typeof(Project))]
    public class CreateProjectDto
    {
        public string Name { get; set; }
        public Guid? ServiceLevel1 { get; set; }
        public string ServiceNameLevel1 { get; set; }

        public Guid? ServiceLevel2 { get; set; }
        public string ServiceNameLevel2 { get; set; }

        public Guid? ServiceLevel3 { get; set; }
        public string ServiceNameLevel3 { get; set; }
    }
}
