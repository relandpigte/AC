using System;

namespace Academically.Services.DisciplineTaxonomies.Dto
{
    public class GetDisciplineTaxonomyFollowerCountDto
    {
        public Guid DisciplineTaxonomyId { get; set; }
        public int FollowerCount { get; set; }
    }
}
