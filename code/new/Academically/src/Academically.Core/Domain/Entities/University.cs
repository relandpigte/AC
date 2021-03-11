using System;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUniversities")]
    public class University : Entity<Guid>
    {
        public string HesaId { get; set; }
        public string HeProvider { get; set; }
        public string UkPrn1 { get; set; }
        public string UkPrn2 { get; set; }
        public string CountryCode { get; set; }
        public bool IsReviewed { get; set; }
    }
}
