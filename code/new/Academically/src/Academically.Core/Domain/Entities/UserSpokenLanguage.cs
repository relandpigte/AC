using Abp.Domain.Entities;
using Academically.Authorization.Users;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Domain.Entities
{
    [Table("AcademicallyUserSpokenLanguages")]
    public class UserSpokenLanguage : Entity<Guid>
    {
        public UserSpokenLanguage()
        {
           
        }

        public long UserId { get; set; }
        public Guid SpokenLanguageId { get; set; }
        public SpokenLanguageProficiency Proficiency { get; set; }

        [ForeignKey("SpokenLanguageId")]
        public SpokenLanguage SpokenLanguage { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
