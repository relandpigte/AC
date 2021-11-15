using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Academically.Services.Projects.Dto
{
    [AutoMap(typeof(ProjectInvitation))]
    public class ProjectInvitationsDto:EntityDto<Guid>
    {
        public Guid ProjectId { get; set; }
        public long TutorId { get; set; }

        public DateTime CreationTime { get; set; }
        public long CreatorUserId { get; set; }

        public ProjectDto Project { get; set; }
        public UserDto CreatorUser { get; set; }
    }
}
