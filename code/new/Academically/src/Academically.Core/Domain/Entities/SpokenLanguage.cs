using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("SpokenLanguages")]
    public class SpokenLanguage : Entity<Guid>
    {
        public SpokenLanguage()
        {
           
        }

        public string Name { get; set; }
    }
}
