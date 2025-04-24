import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

export interface Notification {
  date: string;
  title: string;
  body?: string;
}

export interface RepeatingNotification {
  id: string;
  title: string;
  body?: string;
  hour: number;
  minute: number;
}

const scheduleNotifications = async (notifications: Notification[]) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Notification permissions not granted",
      "Please enable notifications in your settings to receive reminders."
    );
    return;
  }

  try {
    for (const { date, title, body } of notifications) {
      const notificationDate = new Date(date);
      if (isNaN(notificationDate.getTime())) {
        console.warn(`Invalid date: ${date}`);
        continue;
      }

      const now = new Date();
      if (notificationDate <= now) {
        console.warn(`Notification date is in the past: ${date}`);
        continue;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body || "You have a new notification!",
          sound: true,
        },
        trigger: notificationDate,
      });
    }
  } catch (error: any) {
    throw new Error(
      `Error scheduling notifications: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

const scheduleRepeatingNotification = async (
  notification: RepeatingNotification
) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permissions not granted.");
    return;
  }

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body || "You have a new notification!",
        sound: true,
      },
      trigger: {
        hour: notification.hour,
        minute: notification.minute,
        repeats: true,
      },
    });

    console.log(`Scheduled repeating notification with ID: ${identifier}`);
    return identifier;
  } catch (error) {
    console.error("Error scheduling repeating notification:", error);
    throw error;
  }
};

export default { scheduleNotifications, scheduleRepeatingNotification };
