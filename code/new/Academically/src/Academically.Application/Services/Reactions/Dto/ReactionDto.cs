using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Reactions.Dto
{
    [AutoMap(typeof(Reaction))]
    public class ReactionDto : EntityDto<Guid>
    {
        public ReactionType Type { get; set; }
        public string ReferenceId { get; set; }
        public long CreatorUserId { get; set; }
    }
}


