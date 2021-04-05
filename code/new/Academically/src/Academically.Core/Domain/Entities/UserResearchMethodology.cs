using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserResearchMethodologies")]
    public class UserResearchMethodology : CreationAuditedEntity<Guid>
    {
        public UserResearchMethodology()
        {
            UserResearchMethodologyResearchMethods = new HashSet<UserResearchMethodologyResearchMethod>();
        }

        public string Title { get; set; }
        public string Description { get; set; }

        public virtual User CreatorUser { get; set; }

        public virtual ICollection<UserResearchMethodologyResearchMethod> UserResearchMethodologyResearchMethods { get; set; }
    }
}
