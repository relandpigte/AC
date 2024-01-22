using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.CourseSections.Dto
{
	[AutoMap(typeof(CourseSection))]
	public class UpdateCourseSectionDetailsDto : EntityDto<Guid>
	{
		public string Name { get; set; }
		public string Description { get; set; }
		public string Categories { get; set; }
        public string ApproximateLessonDuration { get; set; }
		public Guid? ImageDocumentId { get; set; }
    }
}

