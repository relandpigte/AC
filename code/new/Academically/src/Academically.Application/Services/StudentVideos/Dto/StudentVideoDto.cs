using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Services.Videos.Dto;

namespace Academically.Services.StudentVideos.Dto
{
    [AutoMap(typeof(StudentVideo))]
    public class StudentVideoDto : EntityDto<Guid>
    {
        public Guid VideoId { get; set; }
        public bool SaveOnly { get; set; }

        public VideoDto Video { get; set; }
    }
}

