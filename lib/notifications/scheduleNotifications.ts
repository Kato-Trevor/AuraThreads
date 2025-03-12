import { Alert } from "react-native";
import * as Notifications from "expo-notifications";

interface Notification {
  date: string;
  title: string;
  body?: string;
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
      const trigger = new Date(date);

      if (
        notificationDate.getHours() === 0 &&
        notificationDate.getMinutes() === 0 &&
        notificationDate.getSeconds() === 0
      ) {
        trigger.setHours(9, 0, 0);
      } else {
        trigger.setHours(
          notificationDate.getHours(),
          notificationDate.getMinutes(),
          notificationDate.getSeconds()
        );
      }

      if (isNaN(notificationDate.getTime())) {
        continue;
      }

      const now = new Date();
      if (notificationDate <= now) {
        continue;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body || "You have a new notification!",
          sound: true,
        },
        trigger,
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

export default scheduleNotifications;
