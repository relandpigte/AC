using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.UserTutorials.Dto
{
    [AutoMap(typeof(UserTutorial))]
    public class UserTutorialDto : EntityDto<Guid>
    {
        public long UserId { get; set; }
        public string Information { get; set; }
        public int SupportLevel { get; set; }
        public string Concerns { get; set; }
        public int UrgencyLevel { get; set; }
        public DateTime Deadline { get; set; }
        public IFormFile Picture { get; set; }
        public string PictureFileName { get; set; }
        public IEnumerable<Guid> DisciplineTaxonomyIds { get; set; }
    }
}
