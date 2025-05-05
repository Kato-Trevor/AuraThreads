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
import { LinearGradient } from "expo-linear-gradient";

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
    <View className="flex-row items-center mb-3 mt-6">
      <LinearGradient
        colors={["#588b76", "#588b76"]} // #588b76, "#18392b", "#2a5745"
        className="w-8 h-8 rounded-full items-center justify-center mr-3"
      >
        {icon}
      </LinearGradient>
      <Text className="font-['Poppins-SemiBold'] text-gray-800 text-xl">
        {title}
      </Text>
    </View>
  );

  // Enhanced setting item with switch
  const SettingItem = ({
    title,
    description,
    value,
    onValueChange,
    icon,
  }: any) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
            {icon}
          </View>
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
          trackColor={{ false: "#e0e0e0", true: "#a7d1c0" }}
          thumbColor={value ? "#588b76" : "#f4f3f4"}
          ios_backgroundColor="#e0e0e0"
          style={{
            transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
          }}
        />
      </View>
    </View>
  );

  // Enhanced frequency selector component
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
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
        <Text className="font-['Poppins-Medium'] text-gray-800 mb-4 text-base">
          Reminder Frequency
        </Text>
        <View className="flex-col gap-3">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() =>
                setNotificationsFrequency(option.value as NotificationFrequency)
              }
              className={`border rounded-xl px-4 py-3 flex-row items-center ${
                notificationsFrequency === option.value
                  ? "bg-green-50 border-green-200"
                  : "border-gray-200"
              }`}
            >
              <View
                className={`h-5 w-5 rounded-full mr-3 border-2 flex items-center justify-center ${
                  notificationsFrequency === option.value
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                {notificationsFrequency === option.value && (
                  <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
                )}
              </View>
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
                <Text className="font-['Poppins-Regular'] text-xs text-gray-500 mt-0.5">
                  {option.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="font-['Poppins-Regular'] text-gray-500 text-xs mt-4">
          Reminders will be sent at these times daily
        </Text>
      </View>
    );
  };

  // Enhanced privacy level selector
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
      <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
        <Text className="font-['Poppins-Medium'] text-gray-800 mb-4 text-base">
          Privacy Level
        </Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setPrivacyLevel(option.value as PrivacyLevel)}
            className={`flex-row items-center p-3.5 mb-2.5 rounded-xl ${
              privacyLevel === option.value
                ? "bg-green-50 border border-green-100"
                : "border border-gray-100"
            }`}
          >
            <View
              className={`h-5 w-5 rounded-full mr-3 border-2 flex items-center justify-center ${
                privacyLevel === option.value
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
            >
              {privacyLevel === option.value && (
                <View className="h-2.5 w-2.5 rounded-full bg-green-500" />
              )}
            </View>
            <View
              className={`w-8 h-8 rounded-full mr-3 items-center justify-center ${
                privacyLevel === option.value ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={option.icon as any}
                size={18}
                color={privacyLevel === option.value ? "#18392b" : "#666"}
              />
            </View>
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
              <Text className="font-['Poppins-Regular'] text-xs text-gray-500 mt-0.5">
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Enhanced link item component
  const LinkItem = ({ icon, title, description, onPress }: any) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex-row items-center"
      onPress={onPress}
    >
      <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#18392b" />
      </View>
      <View className="flex-1">
        <Text className="font-['Poppins-Medium'] text-gray-800">{title}</Text>
        <Text className="font-['Poppins-Regular'] text-gray-500 text-sm mt-0.5">
          {description}
        </Text>
      </View>
      <View className="bg-gray-50 w-8 h-8 rounded-full items-center justify-center ml-2">
        <Ionicons name="chevron-forward" size={18} color="#18392b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col p-5 w-full">
          {/* Header with gradient background */}
          <LinearGradient
            colors={["#588b76", "#588b76"]} // #588b76 , "#18392b", "#2a5745"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl mb-5 p-5"
          >
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                className="bg-white/20 w-10 h-10 rounded-full items-center justify-center"
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text className="font-['Poppins-SemiBold'] text-2xl text-white ml-4">
                Settings
              </Text>
            </View>
          </LinearGradient>

          {/* Account Section */}
          <SectionHeader
            title="Account"
            icon={
              <Ionicons name="person-circle-outline" size={18} color="#fff" />
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
              icon={
                <Ionicons name="glasses-outline" size={20} color="#18392b" />
              }
            />
          )}

          {/* <PrivacyLevelSelector /> */}

          {/* Notifications Section */}
          <SectionHeader
            title="Notifications"
            icon={
              <Ionicons name="notifications-outline" size={18} color="#fff" />
            }
          />

          <SettingItem
            title="Mood Log Reminders"
            description="Get reminders to record your daily mood"
            value={enableMoodReminders}
            onValueChange={() => setEnableMoodReminders(!enableMoodReminders)}
            icon={<Ionicons name="happy-outline" size={20} color="#18392b" />}
          />

          {enableMoodReminders && <FrequencySelector />}

          {/* About Section */}
          <SectionHeader
            title="About"
            icon={
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#fff"
              />
            }
          />

          <LinkItem
            icon="code-outline"
            title="Version Info"
            description="Check for updates"
            onPress={() => showToast("Version 2.1.0", "info")}
          />

          <LinkItem
            icon="help-circle-outline"
            title="Help & Support"
            description="FAQs and contact information"
            onPress={() => router.push("/support")}
          />

          <LinkItem
            icon="document-text-outline"
            title="Privacy Policy"
            description="How we handle your data"
            onPress={() => {}}
          />

          {/* Add some space at the bottom */}
          <View className="h-4"></View>
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
