using Academically.Domain.Enums;
using Academically.Services.Posts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.BackgroundJobs.Dto
{
    public class CreateNotificationJobArgs
    {
        public long UserId { get; set; }
        public long ActorId { get; set; }
        public NotificationAction Action { get; set; }
        public NotificationTarget Target { get; set; }
        public Guid SourceId { get; set; }
        public Guid ReferenceId { get; set; }
        public string Url { get; set; }
        public string AdditionalData { get; set; }
    }
}
