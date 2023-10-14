using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("ServicePurchases")]
    public class ServicePurchase : Entity<Guid>
    {
        public Guid? ReferenceId { get; set; }
        public Guid? ServiceOfferId { get; set; }
        public long CreatorUserId { get; set; }
        public DateTime CreationTime { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User CreatorUser { get; set; }

    }
}
