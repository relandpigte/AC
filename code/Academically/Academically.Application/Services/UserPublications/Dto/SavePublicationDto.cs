using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Academically.Services.UserPublications.Dto
{
    public class SavePublicationDto
    {
        [Required]
        public string PublicationCertificate { get; set; }
        [Required]
        public string Publisher { get; set; }
        [Required]
        public long UserId { get; set; }
        [Required]
        public string Summary { get; set; }
    }
}
