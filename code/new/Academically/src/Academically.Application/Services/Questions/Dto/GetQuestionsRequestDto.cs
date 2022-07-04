using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Questions.Dto
{
    public class GetQuestionsRequestDto
    {
        public string ReferenceId { get; set; }
        public long? HostId { get; set; }
        public bool? Answered { get; set; }
        public long? CreatorId { get; set; }
    }
}
