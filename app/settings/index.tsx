import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useToast } from "@/components/ToastProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type NotificationFrequency = "once" | "twice" | "thrice";
type PrivacyLevel = "public" | "friends" | "private";

const Settings = () => {
  const {
    user,
    enableAnonymousID,
    setEnableAnonymousID,
    enableMoodReminders,
    setEnableMoodReminders,
    notificationsFrequency,
    setNotificationsFrequency,
    privacyLevel,
    setPrivacyLevel,
  } = useGlobalContext();
  const { showToast } = useToast();

  // Helper function for section headers
  const SectionHeader = ({ title, icon }: any) => (
    <View className="flex-row items-center mb-2 mt-4">
      {icon}
      <Text className="font-['Poppins-SemiBold'] ml-2 text-gray-700 text-xl">
        {title}
      </Text>
    </View>
  );

  // Helper function for setting items with switch
  const SettingItem = ({
    title,
    description,
    value,
    onValueChange,
    icon,
  }: any) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {icon}
          <View className="ml-3 flex-1">
            <Text className="font-['Poppins-Medium'] text-gray-800 text-base">
              {title}
            </Text>
            {description && (
              <Text className="font-['Poppins-Regular'] text-gray-500 text-sm mt-1">
                {description}
              </Text>
            )}
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#ccc", true: "#18392b" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#ccc"
          style={{
            transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
          }}
        />
      </View>
    </View>
  );

  // Custom frequency selector component
  const FrequencySelector = () => {
    const options = [
      { value: "once", label: "Once a day", time: "12:00 PM" },
      { value: "twice", label: "Twice a day", time: "8:00 AM, 6:00 PM" },
      {
        value: "thrice",
        label: "Thrice a day",
        time: "8:00 AM, 12:00 PM, 6:00 PM",
      },
    ];

    return (
      <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
        <Text className="font-['Poppins-Medium'] text-gray-800 mb-3">
          Reminder Frequency
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() =>
                setNotificationsFrequency(option.value as NotificationFrequency)
              }
              className={`border rounded-full px-4 py-2 flex-row items-center ${
                notificationsFrequency === option.value
                  ? "bg-green-100 border-green-500"
                  : "border-gray-300"
              }`}
            >
              <View
                className={`h-4 w-4 rounded-full mr-2 ${
                  notificationsFrequency === option.value
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
              <View>
                <Text
                  className={`font-['Poppins-Medium'] ${
                    notificationsFrequency === option.value
                      ? "text-green-700"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
                <Text className="font-['Poppins-Regular'] text-xs text-gray-500">
                  {option.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="font-['Poppins-Regular'] text-gray-500 text-sm mt-3">
          Reminders will be sent at these times daily
        </Text>
      </View>
    );
  };

  // Privacy level selector
  const PrivacyLevelSelector = () => {
    const options = [
      {
        value: "public",
        label: "Public",
        icon: "globe",
        description: "Everyone can see your logs",
      },
      {
        value: "friends",
        label: "Friends",
        icon: "people",
        description: "Only friends can see",
      },
      {
        value: "private",
        label: "Private",
        icon: "lock-closed",
        description: "Only you can see",
      },
    ];

    return (
      <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
        <Text className="font-['Poppins-Medium'] text-gray-800 mb-3">
          Privacy Level
        </Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setPrivacyLevel(option.value as PrivacyLevel)}
            className={`flex-row items-center p-3 mb-2 rounded-lg ${
              privacyLevel === option.value
                ? "bg-gray-100 border border-gray-200"
                : "border border-gray-100"
            }`}
          >
            <View
              className={`h-5 w-5 rounded-full mr-3 border-2 flex items-center justify-center ${
                privacyLevel === option.value
                  ? "border-green-500"
                  : "border-gray-400"
              }`}
            >
              {privacyLevel === option.value && (
                <View className="h-3 w-3 rounded-full bg-green-500" />
              )}
            </View>
            <Ionicons
              name={option.icon as any}
              size={18}
              color={privacyLevel === option.value ? "#18392b" : "#666"}
              style={{ marginRight: 8 }}
            />
            <View>
              <Text
                className={`font-['Poppins-Medium'] ${
                  privacyLevel === option.value
                    ? "text-green-800"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
              <Text className="font-['Poppins-Regular'] text-xs text-gray-500">
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View className="flex-col gap-2 p-5 w-full">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={28} color="#18392b" />
            </TouchableOpacity>
            <Text className="font-['Poppins-SemiBold'] text-2xl text-gray-800 ml-3">
              Settings
            </Text>
          </View>

          {/* Account Section */}
          <SectionHeader
            title="Account"
            icon={
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#18392b"
              />
            }
          />

          {user && user.role === "student" && (
            <SettingItem
              title="Anonymous Username"
              description="Hide your real name from others"
              value={enableAnonymousID}
              onValueChange={() => {
                setEnableAnonymousID(!enableAnonymousID);
                showToast(
                  enableAnonymousID
                    ? "Your real name will now be visible"
                    : "All engagements will be anonymous",
                  "info"
                );
              }}
              icon={<Ionicons name="glasses-outline" size={22} color="#666" />}
            />
          )}

          <PrivacyLevelSelector />

          {/* Notifications Section */}
          <SectionHeader
            title="Notifications"
            icon={
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#18392b"
              />
            }
          />

          <SettingItem
            title="Mood Log Reminders"
            description="Get reminders to record your daily mood"
            value={enableMoodReminders}
            onValueChange={() => setEnableMoodReminders(!enableMoodReminders)}
            icon={<Ionicons name="happy-outline" size={22} color="#666" />}
          />

          {enableMoodReminders && <FrequencySelector />}

          {/* About Section */}
          <SectionHeader
            title="About"
            icon={
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#18392b"
              />
            }
          />

          <TouchableOpacity
            className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center"
            onPress={() => showToast("Version 2.1.0", "info")}
          >
            <Ionicons
              name="code-outline"
              size={22}
              color="#666"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="font-['Poppins-Medium'] text-gray-800">
                Version Info
              </Text>
              <Text className="font-['Poppins-Regular'] text-gray-500 text-sm">
                Check for updates
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#666"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center"
            onPress={() => showToast("Help Center opened", "info")}
          >
            <Ionicons
              name="help-circle-outline"
              size={22}
              color="#666"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="font-['Poppins-Medium'] text-gray-800">
                Help & Support
              </Text>
              <Text className="font-['Poppins-Regular'] text-gray-500 text-sm">
                FAQs and contact information
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#666"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-lg p-4 mb-8 shadow-sm border border-gray-100 flex-row items-center">
            <Ionicons
              name="document-text-outline"
              size={22}
              color="#666"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="font-['Poppins-Medium'] text-gray-800">
                Privacy Policy
              </Text>
              <Text className="font-['Poppins-Regular'] text-gray-500 text-sm">
                How we handle your data
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#666"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
});

export default Settings;
