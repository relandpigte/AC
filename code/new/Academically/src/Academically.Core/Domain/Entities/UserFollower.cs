using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;

namespace Academically.Domain.Entities
{
	[Table("UserFollowers")]
	public class UserFollower : CreationAuditedEntity<Guid>
	{
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("CreatorUserId")]
        public User CreatorUser { get; set; }
    }
}

