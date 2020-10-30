using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;

namespace Academically.Entities
{
    [Table("AcademicallyUserResearchMethods")]
    public class UserResearchMethod : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid ResearchMethodId { get; set; }

        public virtual User User { get; set; }
        public virtual ResearchMethod ResearchMethod { get; set; }
    }
}
