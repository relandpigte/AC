using System;
using System.Collections.Generic;
using Abp.AutoMapper;
using Academically.Entities;
using Academically.Services.UserTutorials.Dto;

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

        public UserProfile Student { get; set; }
    }
}
