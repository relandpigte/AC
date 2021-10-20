using System;
using Academically.Notifications;

namespace Academically.Services.CalendarEvents.Notifications
{
    [Serializable]
    public class NewBookingNotificationData : NotificationDataBase
    {
        public string Title { get; set; }

        public NewBookingNotificationData(string title, string profilePictureFileName) : base(profilePictureFileName)
        {
            Title = title;
        }
    }
}
