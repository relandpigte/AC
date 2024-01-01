using Academically.Services.Reactions.Dto;
using System;

namespace Academically.BackgroundJobs.Dto
{
    public class CommentFollowerNotificationJobArgs
    {
        public Guid CommentId { get; set; }
    }
}
