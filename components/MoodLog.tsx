import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { createMoodLog, MoodLog } from "@/lib/appwrite/moods";
import { useGlobalContext } from "@/context/GlobalProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface MoodLogModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MoodLogModal: React.FC<MoodLogModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { user } = useGlobalContext();
  const [mood, setMood] = useState<
    "sad" | "angry" | "neutral" | "happy" | "excited" | null
  >(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setMood(null);
      setReason("");
      setError(null);
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      if (!mood) {
        Alert.alert("Validation Error", "Please select a mood.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const logData: MoodLog = {
        mood: mood,
        reason: reason,
        userId: user.$id,
      };

      await createMoodLog(logData);
      setMood(null);
      setReason("");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log mood. Please try again.");
      Alert.alert("Error", "Failed to log mood. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const moodOptions = [
    {
      key: "sad",
      icon: "emoticon-sad",
      label: "Sad",
      color: "#6366F1",
    },
    {
      key: "angry",
      icon: "emoticon-angry",
      label: "Angry",
      color: "#EF4444",
    },
    {
      key: "neutral",
      icon: "emoticon-neutral",
      label: "Neutral",
      color: "#6B7280",
    },
    {
      key: "happy",
      icon: "emoticon",
      label: "Happy",
      color: "#10B981",
    },
    {
      key: "excited",
      icon: "emoticon-excited",
      label: "Excited",
      color: "#F59E0B",
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
          >
            <View className="bg-white rounded-t-3xl shadow-2xl">
              {/* Header */}
              <View className="bg-gradient-to-r from-violet-50 to-indigo-50 pt-1.5 rounded-t-3xl">
                <View className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-1.5" />

                <View className="flex-row justify-between items-center px-6 py-4">
                  <View>
                    <Text className="text-xs font-pmedium text-violet-500">
                      Create New
                    </Text>
                    <Text className="text-xl font-pbold text-gray-900">
                      Mood Log
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={onClose}
                    className="w-9 h-9 items-center justify-center rounded-full bg-white/70 border border-gray-100"
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color="#4B5563"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content */}
              <View className="max-h-[70vh]">
                <ScrollView className="px-6 py-4">
                  {/* Error message */}
                  {error && (
                    <View className="mb-3 p-2.5 bg-red-50 rounded-xl border border-red-100">
                      <Text className="text-red-600 font-pmedium text-sm">
                        {error}
                      </Text>
                    </View>
                  )}

                  {/* Mood Selection */}
                  <View className="mb-5">
                    <Text className="text-base font-pbold text-gray-800 mb-3">
                      How are you feeling today?
                    </Text>

                    <View className="flex-row justify-between mb-1">
                      {moodOptions.map((moodOption) => (
                        <TouchableOpacity
                          key={moodOption.key}
                          onPress={() => setMood(moodOption.key as any)}
                          disabled={isLoading}
                          className={`items-center p-2 rounded-xl ${
                            mood === moodOption.key
                              ? "bg-violet-50 shadow-sm"
                              : "bg-transparent"
                          }`}
                          style={{ width: "19%" }}
                        >
                          <View
                            className={`w-12 h-12 rounded-full items-center justify-center mb-1.5 ${
                              mood === moodOption.key ? "shadow-sm" : ""
                            }`}
                            style={{
                              backgroundColor:
                                mood === moodOption.key
                                  ? moodOption.color
                                  : "#F3F4F6",
                            }}
                          >
                            <MaterialCommunityIcons
                              name={moodOption.icon as any}
                              size={28}
                              color={
                                mood === moodOption.key ? "white" : "#9CA3AF"
                              }
                            />
                          </View>
                          <Text
                            className={`text-xs font-medium text-center ${
                              mood === moodOption.key
                                ? "text-gray-900"
                                : "text-gray-600"
                            }`}
                          >
                            {moodOption.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Reason Input */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-100">
                    <View className="flex-row items-center mb-2">
                      <MaterialCommunityIcons
                        name="pencil-box"
                        size={18}
                        color="#6D28D9"
                      />
                      <Text className="ml-2 text-sm font-pmedium text-gray-700">
                        Why do you feel this way?
                      </Text>
                    </View>
                    <TextInput
                      placeholder="Describe your feelings here... (Optional)"
                      value={reason}
                      onChangeText={setReason}
                      multiline
                      numberOfLines={3}
                      placeholderTextColor="#9CA3AF"
                      className="text-base font-pmedium text-gray-900 min-h-[80px]"
                      editable={!isLoading}
                    />
                  </View>
                </ScrollView>
              </View>

              {/* Action Buttons */}
              <View className="px-6 pb-8 pt-2 border-t border-gray-100">
                <View className="flex-row space-x-3 mt-3">
                  <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 py-3.5 rounded-xl bg-gray-100 border border-gray-200"
                    disabled={isLoading}
                  >
                    <Text className="text-center font-pbold text-gray-600">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="flex-1 py-3.5 rounded-xl bg-violet-600 shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-center font-pbold text-white">
                        Save Mood
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </BlurView>
    </Modal>
  );
};

export default MoodLogModal;
