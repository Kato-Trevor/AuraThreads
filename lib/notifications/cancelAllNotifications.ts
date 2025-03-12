import * as Notifications from "expo-notifications";

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error: any) {
    throw new Error(
      `Error canceling all notifications: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};
export const cancelNotification = async (identifier: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error: any) {
    throw new Error(
      `Error canceling notification with ID ${identifier}: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export const cancelSelectedNotifications = async (
  identifiers: string[]
): Promise<void> => {
  try {
    for (const identifier of identifiers) {
      await cancelNotification(identifier);
    }
  } catch (error: any) {
    throw new Error(
      `Error canceling selected notifications: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};
