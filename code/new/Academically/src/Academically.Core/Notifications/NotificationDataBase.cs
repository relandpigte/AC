using System;
using Abp.Notifications;

namespace Academically.Notifications
{
    public class NotificationDataBase : NotificationData
    {
        public string ProfilePictureFileName { get; set; }

        public NotificationDataBase(string profilePictureFileName)
        {
            ProfilePictureFileName = profilePictureFileName;
        }
    }
}

