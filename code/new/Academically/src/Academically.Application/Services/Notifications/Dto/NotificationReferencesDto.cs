using Academically.Domain;
using Academically.Domain.Entities;
using Academically.Services.Posts.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Academically.Services.Notifications.Dto
{
    public class NotificationReferencesDto
    {
        // Related post for the notification, if applicable.
        public Post? Post { get; set; }

        // Parent of the related post for the notification, if applicable.
        public Post? ParentPost { get; set; }

        // Related comment for the notification, if applicable.
        public Comment? Comment { get; set; }

        // Related discussion for the notification, if applicable.
        public ServiceDiscussion? Discussion { get; set; }

        // Service of the related discussion for the notification, if applicable.
        public ISimpleService? DiscussionService { get; set; }

        // Related service of the notification
        public ISimpleService? Service { get; set; }
    }
}
