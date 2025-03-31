import { FlatList, TouchableOpacity, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
import Post from "@/components/Post";
import MoodLogModal from "@/components/MoodLog";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "@/components/LoadingSpinner";

const home = () => {
  const [posts, setPosts] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await getAllPostsFromDB();
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: any }) => {
    return <Post post={item} />;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Text>Log Your Mood</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
      />

      <MoodLogModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          // Optional: Refresh mood logs or other data
          console.log("Mood logged successfully");
        }}
      />
    </View>
  );
};

export default home;
