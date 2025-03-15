import { FlatList, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
import { Link } from "expo-router";

const home = () => {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState<any>([]);

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

  return (
    <SafeAreaView>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Link 
            className="p-4 mb-4 bg-gray-100 rounded-lg"
            href={{
              pathname: '/threads/[id]',
              params: { id: `${item.$id}` },
            }}
          >
            <Text className="text-lg text-gray-800">{item.content}</Text>
          </Link >
        )}
      />
    </SafeAreaView>
  );
};

export default home;
