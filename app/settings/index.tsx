import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useToast } from "@/components/ToastProvider";
import { Picker } from '@react-native-picker/picker';

type NotificationFrequency = 'once' | 'twice' | 'thrice';

const Settings = () => {
  const {
    user,
    enableAnonymousID,
    setEnableAnonymousID,
    enableMoodReminders,
    setEnableMoodReminders,
  } = useGlobalContext();
  const { showToast } = useToast();
  const [frequency, setFrequency] = useState<NotificationFrequency>("once");

  return (
    <View className="flex-col gap-2 p-5 w-full h-full">
      {user && user.role === "student" && (
        <>
          <Text className="font-['Poppins-Medium'] ml-2 mr-2 text-gray-700 text-xl">
            Visibility
          </Text>

          <View className="flex-row items-center justify-between w-full pl-2">
            <View className="flex-row items-center">
              <Text className="font-['Poppins-Medium'] ml-2 mr-2 font-medium text-gray-700">
                Use anonymous username
              </Text>
              <TouchableOpacity
                onPress={() =>
                  showToast("All engagements will be anonymous", "info")
                }
              >
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            <Switch
              value={enableAnonymousID}
              onValueChange={() => setEnableAnonymousID(!enableAnonymousID)}
              trackColor={{ false: "#ccc", true: "#18392b" }}
              thumbColor={enableAnonymousID ? "#fff" : "#18392b"}
              style={{
                transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
              }}
            />
          </View>
        </>
      )}
      <Text className="font-['Poppins-Medium'] ml-2 mr-2 text-gray-700 text-xl">
        Notifications
      </Text>
      <View className="flex-row items-center justify-between w-full pl-2">
        <View className="flex-row items-center gap-1">
          <Text className="font-['Poppins-Medium'] ml-2 mr-2 font-medium text-gray-700">
            Receive mood log reminders
          </Text>
        </View>
        <Switch
          value={enableMoodReminders}
          onValueChange={() => setEnableMoodReminders(!enableMoodReminders)}
          trackColor={{ false: "#ccc", true: "#18392b" }}
          thumbColor={enableMoodReminders ? "#fff" : "#18392b"}
          style={{
            transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
          }}
        />
      </View>
      {enableMoodReminders && (
        <View className="mt-2 ml-4">
          <Text className="font-['Poppins-Medium'] text-gray-700 mb-2">
            Frequency
          </Text>
          <View className="border border-gray-300 rounded-md">
            <Picker
              selectedValue={frequency}
              onValueChange={(itemValue) =>
                setFrequency(itemValue as NotificationFrequency)
              }
              style={{ height: 52 }}
            >
              <Picker.Item label="Once a day (12:00 PM)" value="once" />
              <Picker.Item
                label="Twice a day (8:00 AM, 6:00 PM)"
                value="twice"
              />
              <Picker.Item
                label="Thrice a day (8AM, 12PM, 6PM)"
                value="thrice"
              />
            </Picker>
          </View>
          <Text className="font-['Poppins-Regular'] text-gray-500 text-sm mt-1 ml-1">
            This applies daily
          </Text>
        </View>
      )}
    </View>
  );
};

export default Settings;
