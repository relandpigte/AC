using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Entities
{
    [Table("AcademicallyPasswordResets")]
    public class PasswordReset : Entity<Guid>
    {
        public virtual DateTime DateSent { get; set; }
        public virtual bool IsResetted { get; set; }
        public virtual DateTime? ResetDate { get; set; }
        public virtual string Email { get; set; }
    }
}
