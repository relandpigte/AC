using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Application.Services.Dto;
using Abp.Auditing;
using Abp.Domain.Entities.Auditing;
using Academically.Authorization.Users;
using Academically.Domain.Enums;

namespace Academically.Domain.Entities
{
    [Table("SavedServices")]
    public class SavedService : CreationAuditedEntity<Guid>
    {
        public Guid ReferenceId { get; set; }

        [ForeignKey("CreatorUserId")]
        public virtual User User { get; set; }
    }
}




