using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Entities;

namespace Academically.Services.SupportServices.Dto
{
    [AutoMap(typeof(SupportServiceRequest))]
    public class SupportServiceRequestDto : EntityDto<Guid>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Comments { get; set; }
        [Required]
        public Guid ParentId { get; set; }
    }
}
