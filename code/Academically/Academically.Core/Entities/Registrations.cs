using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Entities.Enums;

namespace Academically.Entities
{
    [Table("AcademicallyRegistrations")]
    public class Registration : Entity<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public DateTime DateRegistered { get; set; }
        public DateTime? DateConfirmed { get; set; }
        public RegistrationStatus RegistrationStatus { get; set; }
        public DateTime? DateOfBirth { get; set; }
    }
}
