using Abp.Application.Services.Dto;
using Academically.Services.DisciplineTaxonomies.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Posts.Dto
{
    public class PostEditHistoryDto
    {
        public PostEditHistoryDto()
        {
            PostTopics = new List<DisciplineTaxonomyDto>();     
        }

        public DateTime ChangeTime { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public List<DisciplineTaxonomyDto> PostTopics { get; set; }
    }
}
