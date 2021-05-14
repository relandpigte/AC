using Academically.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserSpokenLanguages.Dto
{
    public class EditUserSpokenLanguagesDto
    {
        public long UserId { get; set; }
        public SpokenLanguageProficiency EnglishProficiency { get; set; }
        public List<EditOtherUserSpokenLanguageDto> OtherUserSpokenLanguages { get; set; }
    }

    public class EditOtherUserSpokenLanguageDto
    {
        public Guid SpokenLanguageId { get; set; }
        public SpokenLanguageProficiency Proficiency { get; set; }
    }
}
