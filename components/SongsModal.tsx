import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SongsList from "./SongsList";

interface SongsModalProps {
  visible: boolean;
  selectedSong: Song | null;
  setSelectedSong: (item: Song | null) => void;
  onClose: () => void;
}

const SongsModal: React.FC<SongsModalProps> = ({
  visible,
  onClose,
  selectedSong,
  setSelectedSong,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <View
          className="bg-gradient-to-r from-violet-50 to-indigo-50"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row justify-between items-center px-6 py-4">
            <Text className="text-xl font-pbold text-gray-900">Songs</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 items-center justify-center rounded-full bg-white/70 border border-gray-100"
            >
              <MaterialCommunityIcons name="close" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <SongsList
            selectedSong={selectedSong}
            onSongSelect={setSelectedSong}
          />
        </View>

        {/* Action Buttons */}
        <View
          className="bg-white border-t border-gray-100"
          style={{ paddingBottom: insets.bottom }}
        >
          <View className="px-6 pb-2 pt-2">
            <View className="flex-row space-x-3 mt-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3.5 rounded-xl bg-gray-100 border border-gray-200"
              >
                <Text className="text-center font-pbold text-gray-600">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                className={`flex-1 py-3.5 rounded-xl shadow-sm ${
                  selectedSong
                    ? "bg-secondary hover:bg-secondary-dark"
                    : "bg-gray-300"
                }`}
                disabled={selectedSong === null}
              >
                <Text className="text-center font-pbold text-white">
                  Select Song
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SongsModal;
