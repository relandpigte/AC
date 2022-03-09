using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;

namespace Academically.Services.StudentVideos.Dto
{
    [AutoMapFrom(typeof(StudentVideo))]
    public class GetStudentVideoDto : EntityDto<Guid>
    {
        public Guid VideoId { get; set; }
        public bool SaveOnly { get; set; }
        public long CreatorUserId { get; set; }
    }
}

