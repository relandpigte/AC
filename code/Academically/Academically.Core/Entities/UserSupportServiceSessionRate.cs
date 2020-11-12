using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyUserSupportServiceSessionRates")]
    public class UserSupportServiceSessionRate : Entity<Guid>
    {
        public Guid UserSupportServiceId { get; set; }
        public decimal SingleSessionRate { get; set; }
        public decimal MultipleSessionRate { get; set; }
        public int MultipleSessionCount { get; set; }
        public bool FreeSession { get; set; }

        [ForeignKey("UserSupportServiceId")]
        public UserSupportService UserSupportService { get; set; }
    }
}
