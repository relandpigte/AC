using Academically.Domain.Enums;
using System;
using System.Collections.Generic;

namespace Academically.Services.UserServices.Dto
{
    public class UserServiceForListDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ServiceExpertiseLevel ExpertiseLevel { get; set; }
        public Guid ServiceMappingId { get; set; }

        public IEnumerable<string> Subjects { get; set; }
        public IEnumerable<string> DisciplineTaxonomies { get; set; }
    }
}
