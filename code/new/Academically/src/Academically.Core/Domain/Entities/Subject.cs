using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallySubjects")]
    public class Subject : Entity<Guid>
    {
        public string Name { get; set; }
    }
}
