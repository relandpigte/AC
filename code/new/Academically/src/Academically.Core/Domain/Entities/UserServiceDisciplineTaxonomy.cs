using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserServiceDisciplineTaxonomies")]
    public class UserServiceDisciplineTaxonomy : Entity<Guid>
    {
        public Guid UserServiceId { get; set; }
        public Guid DisciplineTaxonomyId { get; set; }

        [ForeignKey("UserServiceId")]
        public UserService UserService { get; set; }

        [ForeignKey("DisciplineTaxonomyId")]
        public DisciplineTaxonomy DisciplineTaxonomy { get; set; }
    }
}
