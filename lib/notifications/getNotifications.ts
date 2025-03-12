import * as Notifications from "expo-notifications";

export const getAllNotifications = async () => {
  try {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error: any) {
    throw new Error(
      `Error getting notifications: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export const getNotificationIdentifiersByTitles = async (
  titles: string[]
): Promise<string[]> => {
  try {
    const notifications = await getAllNotifications();

    const filteredNotifications = notifications.filter(
      (notification) =>
        notification.content?.title &&
        titles.includes(notification.content.title)
    );

    return filteredNotifications.map((notification) => notification.identifier);
  } catch (error: any) {
    throw new Error(
      `Error getting notification identifiers by titles: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};
