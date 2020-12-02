using System;
using System.Collections.Generic;

namespace Academically.Services.DisciplineTaxonomies.Dto
{
    public class GetAllDisciplineTaxonomyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ParentIdMap { get; set; }
        public int Size { get; set; }
        public int TotalDisciplines { get; set; }
        public bool IsEditable { get; set; }

        public IEnumerable<GetAllDisciplineTaxonomyDto> Children { get; set; }
    }
}
