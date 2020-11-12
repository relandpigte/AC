using Abp.AutoMapper;
using Academically.Entities;
using Academically.Services.UserTutorials.Dto;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Proposals.Dto
{
    [AutoMapFrom(typeof(UserTutorial))]
    public class GetStudentProposalDto
    {
        public string Information { get; set; }
        public int SupportLevel { get; set; }
        public string Concerns { get; set; }
        public int UrgencyLevel { get; set; }
        public DateTime Deadline { get; set; }
        public string SubjectArea { get; set; }
        public IEnumerable<UserTutorialDisciplineTaxonomyDto> UserTutorialDisciplineTaxonomies { get; set; }
        public string ProfilePictureFileName { get; set; }
        public UserDto User { get; set; }
    }
}
