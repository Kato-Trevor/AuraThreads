import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite/auth";
import * as SecureStore from "expo-secure-store";

const ANONYMOUS_ID_KEY = "enable_anonymous_id";
const MOOD_REMINDERS_KEY = "enable_mood_reminders";
const NOTIFICATIONS_FREQUENCY_KEY = "notifications_frequency";
const PRIVACY_LEVEL_KEY = "privacy_level";

type NotificationFrequency = "once" | "twice" | "thrice";
type PrivacyLevel = "public" | "friends" | "private";

type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  enableAnonymousID: boolean;
  setEnableAnonymousID: (value: boolean) => void;
  enableMoodReminders: boolean;
  setEnableMoodReminders: (value: boolean) => void;
  notificationsFrequency: NotificationFrequency;
  setNotificationsFrequency: (value: NotificationFrequency) => void;
  privacyLevel: PrivacyLevel;
  setPrivacyLevel: (value: PrivacyLevel) => void;
  isLoading: boolean;
};

const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  enableAnonymousID: false,
  setEnableAnonymousID: () => {},
  enableMoodReminders: false,
  setEnableMoodReminders: () => {},
  notificationsFrequency: "once",
  setNotificationsFrequency: () => {},
  privacyLevel: "friends",
  setPrivacyLevel: () => {},
  isLoading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const saveToSecureStore = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Error saving ${key} to SecureStore:`, error);
  }
};

const loadFromSecureStore = async <T,>(
  key: string,
  defaultValue: T
): Promise<T> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value !== null ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from SecureStore:`, error);
    return defaultValue;
  }
};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<null | any>(null);
  const [isLoading, setLoading] = useState(true);

  const [enableAnonymousID, setEnableAnonymousIDState] = useState(false);
  const [enableMoodReminders, setEnableMoodRemindersState] = useState(false);
  const [notificationsFrequency, setNotificationsFrequencyState] =
    useState<NotificationFrequency>("once");
  const [privacyLevel, setPrivacyLevelState] =
    useState<PrivacyLevel>("friends");

  const setEnableAnonymousID = (value: boolean) => {
    setEnableAnonymousIDState(value);
    saveToSecureStore(ANONYMOUS_ID_KEY, JSON.stringify(value));
  };

  const setEnableMoodReminders = (value: boolean) => {
    setEnableMoodRemindersState(value);
    saveToSecureStore(MOOD_REMINDERS_KEY, JSON.stringify(value));
  };

  const setNotificationsFrequency = (value: NotificationFrequency) => {
    setNotificationsFrequencyState(value);
    saveToSecureStore(NOTIFICATIONS_FREQUENCY_KEY, JSON.stringify(value));
  };

  const setPrivacyLevel = (value: PrivacyLevel) => {
    setPrivacyLevelState(value);
    saveToSecureStore(PRIVACY_LEVEL_KEY, JSON.stringify(value));
  };

  // Load user authentication
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Load settings from SecureStore
  useEffect(() => {
    const loadSettings = async () => {
      const anonymousID = await loadFromSecureStore(ANONYMOUS_ID_KEY, false);
      const moodReminders = await loadFromSecureStore(
        MOOD_REMINDERS_KEY,
        false
      );
      const frequency = await loadFromSecureStore<NotificationFrequency>(
        NOTIFICATIONS_FREQUENCY_KEY,
        "once"
      );
      const privacy = await loadFromSecureStore<PrivacyLevel>(
        PRIVACY_LEVEL_KEY,
        "friends"
      );

      setEnableAnonymousIDState(anonymousID);
      setEnableMoodRemindersState(moodReminders);
      setNotificationsFrequencyState(frequency);
      setPrivacyLevelState(privacy);
    };

    loadSettings();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        enableAnonymousID,
        setEnableAnonymousID,
        enableMoodReminders,
        setEnableMoodReminders,
        notificationsFrequency,
        setNotificationsFrequency,
        privacyLevel,
        setPrivacyLevel,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
