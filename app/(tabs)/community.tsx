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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/assets/colors/colors";

const Community = () => {
  const [posts, setPosts] = useState<any>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
      }

      const fetchedPosts = await getAllPostsFromDB();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
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

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.darkestGreen]}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-lg">No posts available</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-5 right-5 rounded-full w-16 h-16 justify-center items-center shadow-lg"
        style={{ backgroundColor: Colors.darkestGreen }}
        onPress={() => router.push("/create-post")}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default Community;



