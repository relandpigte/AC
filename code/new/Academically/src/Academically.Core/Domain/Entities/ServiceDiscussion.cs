using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("ServiceDiscussion")]
    public class ServiceDiscussion : Entity<long>
    {
        public Guid ServiceId { get; set; }
        public int ServiceType { get; set; }
        public Guid PostId { get; set; }
    
        [ForeignKey("PostId")]
        public virtual Post Post { get; set; }
    }
}