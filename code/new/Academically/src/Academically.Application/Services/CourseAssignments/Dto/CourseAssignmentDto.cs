using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Documents.Dto;
using Academically.Services.StudentCourseSections.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Http;

namespace Academically.Services.CourseAssignments.Dto
{
    [AutoMap(typeof(CourseAssignment))]
    public class CourseAssignmentDto : EntityDto<Guid>
    {
        public Guid StudentCourseSectionId { get; set; }
        public Guid DocumentId { get; set; }
        public DateTime CreationTime { get; set; }

        public StudentCourseSectionDto StudentCourseSection { get; set; }
        public DocumentDto Document { get; set; }
        public UserDto CreatorUser { get; set; }
    }
}

