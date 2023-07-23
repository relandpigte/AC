using System;

namespace Academically.Services.Comments.Dto
{
    public class CommentEditHistoryDto
    {
        public DateTime ChangeTime { get; set; }
        public string Body { get; set; }
    }
}