using Abp.Domain.Entities;
using Academically.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyUserTutorials")]
    public class UserTutorial : Entity<Guid>
    {
        public long UserId { get; set; }
        public string Information { get; set; }
        public int SupportLevel { get; set; }
        public string Concerns { get; set; }
        public int UrgencyLevel { get; set; }
        public DateTime DeadLine { get; set; }
        public string PictureFileName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Guid UserProfileId { get; set; }
        public Guid ServiceTypeId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("UserProfileId")]
        public UserProfile UserProfile { get; set; }
    }
}
