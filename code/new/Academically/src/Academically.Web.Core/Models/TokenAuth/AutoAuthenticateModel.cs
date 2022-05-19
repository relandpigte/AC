using System;
using System.ComponentModel.DataAnnotations;

namespace Academically.Models.TokenAuth
{
    public class AutoAuthenticateModel
    {
        [Required]
        public AutoAuthenticateType Type { get; set; }

        [Required]
        public Guid ReferenceId { get; set; }
    }
}
