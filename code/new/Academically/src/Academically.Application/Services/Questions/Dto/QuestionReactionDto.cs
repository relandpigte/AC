using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;

namespace Academically.Services.Questions.Dto
{
    [AutoMap(typeof(QuestionReaction))]
    public class QuestionReactionDto : EntityDto<Guid?>
    {
        public ReactionType Type { get; set; }
        public Guid QuestionId { get; set; }
        public long CreatorUserId { get; set; }
    }
}

