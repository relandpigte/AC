using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Entities.Enums;

namespace Academically.Entities
{
    [Table("AcademicallyRegistrations")]
    public class Registration : Entity<Guid>
    {
        public virtual string FirstName { get; set; }
        public virtual string LastName { get; set; }
        public virtual string EmailAddress { get; set; }
        public virtual DateTime DateRegistered { get; set; }
        public virtual DateTime? DateConfirmed { get; set; }
        public virtual RegistrationStatus RegistrationStatus { get; set; }
    }
}
