using System;

namespace Academically.Services.DisciplineTaxonomies.Dto
{
    public class GetDisciplineTaxonomyChildrenCountDto
    {
        public Guid DisciplineTaxonomyId { get; set; }
        public int ChildCount { get; set; }
    }
}
