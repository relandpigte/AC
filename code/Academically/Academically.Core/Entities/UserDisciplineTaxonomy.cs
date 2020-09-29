using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;

namespace Academically.Entities
{
    [Table("AcademicallyUserDisciplineTaxonomies")]
    public class UserDisciplineTaxonomy : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        public virtual User User { get; set; }
        public virtual DisciplineTaxonomy DisciplineTaxonomy { get; set; }
    }
}
