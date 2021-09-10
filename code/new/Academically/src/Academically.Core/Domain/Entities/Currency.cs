using Abp.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyCurrencies")]
    public class Currency : Entity<Guid>
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsEnabled { get; set; }
    }
}
