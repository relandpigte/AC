using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Academically.Domain.Entities;
using Academically.Domain.Enums;
using Academically.Services.Articles.Dto;
using Academically.Services.Coachings.Dto;
using Academically.Services.Courses.Dto;
using Academically.Services.Events.Dto;
using Academically.Services.Videos.Dto;
using Academically.Users.Dto;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Academically.Services.Comments.Dto
{
    [AutoMap(typeof(Comment))]
    public class CommentDto : EntityDto<Guid>
    {
        public string Body { get; set; }
        public Guid? ParentId { get; set; }
        public string ReferenceId { get; set; }
        public DateTime CreationTime { get; set; }

        public Guid? ServiceId { get; set; }

        public long? TaggedId { get; set; }

        public ServicesType? ServiceType { get; set; }

        public int ReplyCount { get; set; }

        public CommentDto Parent { get; set; }
        public UserDto CreatorUser { get; set; }
        public UserDto TaggedUser { get; set; }

        public IEnumerable<CommentDto> Children { get; set; }
        public IEnumerable<CommentReactionDto> CommentReactions { get; set; }

        // These objects is filled in depending on the type of service attached to the comment

        [NotMapped]
        public ArticleDto Article { get; set; }

        [NotMapped]
        public EventDto Event { get; set; }

        [NotMapped]
        public CourseDto Course { get; set; }

        [NotMapped]
        public VideoDto Video { get; set; }

        [NotMapped]
        public CoachingDto Coaching { get; set; }
    }
}
