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
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Academically.Services.Posts.Dto
{
    [AutoMapFrom(typeof(Post))]
    public class PostDto : FullAuditedEntityDto<Guid>
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public Guid? SpaceId { get; set; }
        public PostType Type { get; set; }
        public Guid? ParentId { get; set; }
        public virtual PostDto Parent { get; set; }
        public UserDto CreatorUser { get; set; }
        public bool IsHidden { get; set; }
        public Guid? SharedId { get; set; }
        public SharedType? SharedType { get; set; }
        public ServicesType? SharedServiceType { get; set; }

        [NotMapped]
        public int CommentsCount { get; set; }

        [NotMapped]
        public int SharesCount { get; set; }

        [NotMapped]
        public int ReactionsCount { get; set; }

        public IEnumerable<PostTopicDto> PostTopics { get; set; }
        public IEnumerable<PostAttachmentDto> PostAttachments { get; set; }
        public IEnumerable<PostDto> Children { get; set; }
        public IEnumerable<UserDto> Participants { get; set; }
        public IEnumerable<PostNotificationDto> PostNotification { get; set; }
        public IEnumerable<PostVisibilityDto> PostVisibility { get; set; }

        [NotMapped]
        public double ActivityPoints { get { return (this.CommentsCount * 2) + this.ReactionsCount + this.Children.Sum(c => c.ActivityPoints); } }

        [NotMapped]
        public PostDto SharedPost { get; set; }
        [NotMapped]
        public ArticleDto SharedServiceArticle { get; set; }
        [NotMapped]
        public EventDto SharedServiceEvent { get; set; }
        [NotMapped]
        public CourseDto SharedServiceCourse { get; set; }
        [NotMapped]
        public VideoDto SharedServiceVideo { get; set; }
        [NotMapped]
        public CoachingDto SharedServiceCoaching { get; set; }
        [NotMapped]
        public List<PostEditHistoryDto> PostEditHistories { get; set; }
    }
}
