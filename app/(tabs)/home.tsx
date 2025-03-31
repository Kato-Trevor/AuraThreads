import { FlatList, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
import Post from "@/components/Post";
import MoodLogModal from "@/components/MoodLog";
import { SafeAreaView } from "react-native-safe-area-context";

const home = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getAllPostsFromDB();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: any }) => {
    return <Post post={item} />;
  };

  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
};

export default home;
