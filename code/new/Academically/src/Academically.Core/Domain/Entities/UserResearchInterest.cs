using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
    [Table("UserResearchInterests")]
    public class UserResearchInterest : CreationAuditedEntity<Guid>
    {
        public UserResearchInterest()
        {
            UserResearchInterestDisciplineTaxonomies = new HashSet<UserResearchInterestDisciplineTaxonomy>();
        }

        public string Title { get; set; }
        public string Description { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

        public virtual ICollection<UserResearchInterestDisciplineTaxonomy> UserResearchInterestDisciplineTaxonomies { get; set; }
    }
}
