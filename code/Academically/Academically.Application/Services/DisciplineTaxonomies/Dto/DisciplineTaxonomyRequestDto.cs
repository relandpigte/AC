using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Academically.Services.DisciplineTaxonomies.Dto
{
    [AutoMap(typeof(DisciplineTaxonomyRequest))]
    public class DisciplineTaxonomyRequestDto : EntityDto<Guid>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Notes { get; set; }
        [Required]
        public Guid ParentId { get; set; }
    }
}
