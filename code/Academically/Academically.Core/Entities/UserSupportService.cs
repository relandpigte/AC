using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Academically.Authorization.Users;

namespace Academically.Entities
{
    [Table("AcademicallyUserSupportServices")]
    public class UserSupportService : Entity<Guid>
    {
        public long UserId { get; set; }
        public Guid SupportServiceId { get; set; }

        public virtual User User { get; set; }
        public virtual SupportService SupportService { get; set; }
    }
}
