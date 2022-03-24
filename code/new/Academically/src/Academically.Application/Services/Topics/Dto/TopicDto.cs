using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Topics.Dto
{
	[AutoMapFrom(typeof(Topic))]
	public class TopicDto : EntityDto<Guid>
	{
        public string Name { get; set; }
    }
}

