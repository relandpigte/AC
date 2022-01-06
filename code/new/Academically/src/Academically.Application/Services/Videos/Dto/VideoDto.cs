using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Documents.Dto;

namespace Academically.Services.Videos.Dto
{
	[AutoMap(typeof(Video))]
	public class VideoDto : EntityDto<Guid>
	{
		public VideoType Type { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public VideoStatus Status { get; set; }
		public Guid? ParentId { get; set; }
		public Guid? DocumentId { get; set; }

		public string VideoUrl { get; set; }

		public VideoDto Parent { get; set; }
		public DocumentDto Document { get; set; }

        public IEnumerable<VideoDto> Children { get; set; }

        public VideoDto()
		{
		}
	}
}

