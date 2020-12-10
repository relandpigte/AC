using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Entities
{
    [Table("AcademicallyUserTutorials")]
    public class UserTutorial : Entity<Guid>
    {
        public string Information { get; set; }
        public int SupportLevel { get; set; }
        public string Concerns { get; set; }
        public int UrgencyLevel { get; set; }
        public DateTime DeadLine { get; set; }
        public string PictureFileName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid ServiceTypeId { get; set; }
        public Guid StudentId { get; set; }

        [ForeignKey("StudentId")]
        public UserProfile Student { get; set; }

        public virtual ICollection<UserTutorialDisciplineTaxonomy> UserTutorialDisciplineTaxonomies { get; set; }
    }
}
