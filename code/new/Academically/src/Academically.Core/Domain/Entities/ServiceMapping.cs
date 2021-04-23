using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyServiceMappings")]
    public class ServiceMapping : Entity<Guid>
    {
        public Guid? Node1Id { get; set; }
        public Guid? Node2Id { get; set; }
        public Guid? Node3Id { get; set; }

        [ForeignKey("Node3Id")]
        public Service Service { get; set; }
    }
}
