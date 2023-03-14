using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("PhoneVerifications")]
    public class PhoneVerification : Entity<Guid>
    {
        public long UserId { get; set; }
        public string Recipient { get; set; }
        public string Code { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime? DateConfirmed { get; set; }
    }
}
