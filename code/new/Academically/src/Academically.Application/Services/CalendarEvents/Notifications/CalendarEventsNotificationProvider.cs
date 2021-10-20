using Abp.Localization;
using Abp.Notifications;
using Academically.Notifications;

namespace Academically.Services.CalendarEvents.Notifications
{
    public class CalendarEventsNotificationProvider : NotificationProvider
    {
        public CalendarEventsNotificationProvider()
        {
        }

        public override void SetNotifications(INotificationDefinitionContext context)
        {
            context.Manager.Add(
                new NotificationDefinition(
                    NotificationNames.Notifications_CalendarEvents_NewBooking,
                    displayName: new LocalizableString("NewBookingNotificationDefinition", AcademicallyConsts.LocalizationSourceName)
                    )
                );
        }
    }
}
