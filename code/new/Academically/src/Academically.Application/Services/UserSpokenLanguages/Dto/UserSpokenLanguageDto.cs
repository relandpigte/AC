using Abp.Application.Services.Dto;
using Academically.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserSpokenLanguages.Dto
{
    public class UserSpokenLanguageDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public Guid SpokenLanguageId { get; set; }
        public string SpokenLanguageName { get; set; }
        public SpokenLanguageProficiency Proficiency { get; set; }
    }
}
