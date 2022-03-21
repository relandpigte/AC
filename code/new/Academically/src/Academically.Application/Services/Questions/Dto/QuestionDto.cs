using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Users.Dto;
using System;
using System.Collections.Generic;

namespace Academically.Services.Questions.Dto
{
    [AutoMap(typeof(Question))]
    public class QuestionDto : EntityDto<Guid>
    {
        public string Body { get; set; }
        public Guid? ParentId { get; set; }
        public string ReferenceId { get; set; }
        public DateTime CreationTime { get; set; }

        public int ReplyCount { get; set; }

        public QuestionDto Parent { get; set; }
        public UserDto CreatorUser { get; set; }

        public IEnumerable<QuestionDto> Children { get; set; }
        public IEnumerable<QuestionReactionDto> QuestionReactions { get; set; }
    }
}
