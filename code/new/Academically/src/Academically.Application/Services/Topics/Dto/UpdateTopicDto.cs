using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Topics.Dto
{
    [AutoMapTo(typeof(Topic))]
	public class UpdateTopicDto : EntityDto<Guid>
	{
        public string Name { get; set; }
    }
}

