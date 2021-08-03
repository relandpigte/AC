using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using System;

namespace Academically.Services.Sessions.Dto
{
    [AutoMap(typeof(SessionCandidate))]
    public class SessionCandidateDto : EntityDto<Guid>
    {
        public string Value { get; set; }
        public SessionCandidateType Type { get; set; }
        public Guid SessionId { get; set; }
    }
}
