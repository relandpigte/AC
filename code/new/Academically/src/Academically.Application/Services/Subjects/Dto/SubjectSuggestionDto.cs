using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;

namespace Academically.Services.Subjects.Dto
{
    [AutoMap(typeof(Subject))]
    public class SubjectSuggestionDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public DateTime? CreationTime { get; set; }

        public string ServiceName { get; set; }

        public UserDto CreatorUser { get; set; }
    }
}
