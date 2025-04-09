import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
import Post from "@/components/Post";
import MoodLogModal from "@/components/MoodLog";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "@/components/LoadingSpinner";

const Home = () => {
  const [posts, setPosts] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const fetchedPosts = await getAllPostsFromDB();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const renderPost = ({ item }: { item: any }) => {
    return <Post post={item} />;
  };

  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <TouchableOpacity
        className="bg-secondary p-3 mx-4 my-3 rounded-lg"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-white text-center font-medium">
          Log Your Mood
        </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#588b76"]}
            tintColor="#588b76"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-lg">No posts available</Text>
          </View>
        }
      />

      <MoodLogModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          fetchPosts();
          setIsModalVisible(false);
          console.log("Mood logged successfully");
        }}
      />
    </View>
  );
};

export default Home;
