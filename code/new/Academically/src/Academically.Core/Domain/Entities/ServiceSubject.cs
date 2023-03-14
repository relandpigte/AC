using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ServiceSubjects")]
    public class ServiceSubject
    {
        [Key, Column(Order = 0)]
        public Guid ServiceId { get; set; }
        [Key, Column(Order = 1)]
        public Guid SubjectId { get; set; }

        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
    }
}
