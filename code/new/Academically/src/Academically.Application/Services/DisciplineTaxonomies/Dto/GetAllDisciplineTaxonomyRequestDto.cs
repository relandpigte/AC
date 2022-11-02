using System;
using Abp.Application.Services.Dto;
using Academically.Domain.Enums;

namespace Academically.Services.Articles.Dto
{
    public class GetAllDisciplineTaxonomyRequestDto
    {
        public Guid? ParentId { get; set; }
        public string Keyword { get; set; }
        public bool IncludeChildren { get; set; }
        public bool ExcludeFollowing { get; set; }
        public string Sorting{ get; set; }
    }
}