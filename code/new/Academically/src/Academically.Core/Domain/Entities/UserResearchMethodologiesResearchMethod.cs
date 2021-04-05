using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserResearchMethodologyResearchMethods")]
    public class UserResearchMethodologyResearchMethod : Entity<Guid>
    {
        public Guid UserResearchMethodologyId { get; set; }
        public Guid ResearchMethodId { get; set; }

        public virtual UserResearchMethodology UserResearchMethodology { get; set; }
        public virtual ResearchMethod ResearchMethod { get; set; }
    }
}
