using System.ComponentModel.DataAnnotations;

namespace Academically.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}