using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserServiceSubjects")]
    public class UserServiceSubject : Entity<Guid>
    {
        public Guid UserServiceId { get; set; }
        public Guid SubjectId { get; set; }

        [ForeignKey("UserServiceId")]
        public UserService UserService { get; set; }

        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
    }
}
