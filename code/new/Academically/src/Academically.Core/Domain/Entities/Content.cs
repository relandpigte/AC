using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Academically.Domain.Entities
{
    [Table("Contents")]
    public class Content : CreationAuditedEntity<Guid>
    {
        public string PageContent { get; set; }
        public string ReferenceId { get; set; }
    }
}
