using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.Forums.Dto
{
	[AutoMapTo(typeof(Forum))]
	public class UpdateForumDto : EntityDto<Guid>
	{
        public string Message { get; set; }
    }
}

