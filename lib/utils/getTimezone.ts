import { Alert, Linking } from "react-native";
import * as Location from "expo-location";

export const getDynamicTimezone = async (): Promise<string> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return new Promise((resolve, reject) => {
        Alert.alert(
          "Location Access Required",
          "Please enable location access in your settings to get accurate timezone information.",
          [
            {
              text: "Open Settings",
              onPress: async () => {
                await Linking.openSettings();
                resolve(Intl.DateTimeFormat().resolvedOptions().timeZone);
              },
            },
            {
              text: "Cancel",
              onPress: () => {
                resolve(Intl.DateTimeFormat().resolvedOptions().timeZone);
              },
              style: "cancel",
            },
          ]
        );
      });
    }

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!timezone) {
        throw new Error("Unable to determine timezone");
      }

      return timezone;
    } catch (locationError) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  } catch (error) {
    return "UTC";
  }
};
