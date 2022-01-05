using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Videos.Dto
{
	[AutoMap(typeof(Video))]
	public class VideoDto : EntityDto<Guid>
	{
		public VideoType Type { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public VideoStatus Status { get; set; }

		public VideoDto()
		{
		}
	}
}

