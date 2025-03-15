import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useToast } from "@/components/ToastProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import Avatar from "@/components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { recommendedSongs } from "@/mocks/mock-data";
import { addPostToDB } from "@/lib/appwrite/appwrite";

const createPost = () => {
  const { user } = useGlobalContext();
  const { showToast } = useToast();
  const [postContent, setPostContent] = useState("");

  const handleCancel = () => {
    router.back();
  };

  const handlePostCreation = async () => {
    try {
      await addPostToDB(postContent, user.$id);
      showToast("Post created successfully!", "success");
      router.replace("/home");
    } catch (error: any) {
      console.log("Error creating post:", error);
      showToast("Failed to create post", "error");
    }
  };

  const renderMusicCards = ({ item }: { item: any }) => {
    if (item.type === "icon") {
      return (
        <TouchableOpacity
          className="w-20 h-20 bg-gray-200 rounded-lg justify-center items-center mr-2"
          onPress={() => router.push("/search-songs")}
        >
          <Ionicons name="musical-notes" size={24} color="#F032DA" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          className="w-20 h-20 bg-gray-200 rounded-lg justify-center items-center mr-2"
          onPress={() => console.log("Play song")}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handleCancel}>
          <Text className="text-secondary text-lg">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePostCreation}
          disabled={postContent === ""}
          className="bg-secondary py-2 px-4 rounded"
        >
          <Text className="text-white text-lg">Post</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-start mb-4">
        <Avatar username={user.username} />
        <TextInput
          className="flex-1 px-4 rounded-lg text-lg"
          placeholder="How are you feeling?"
          multiline
          value={postContent}
          onChangeText={setPostContent}
          textAlignVertical="top"
        />
      </View>
      <FlatList
        data={recommendedSongs}
        renderItem={renderMusicCards}
        keyExtractor={(item) => item.id}
        horizontal
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="absolute bottom-4 left-0 right-0"
      />
    </SafeAreaView>
  );
};

export default createPost;
