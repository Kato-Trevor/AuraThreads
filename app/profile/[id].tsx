import {
  Text,
  StatusBar,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserById } from "@/lib/appwrite/auth";
import { getPostsByUserID } from "@/lib/appwrite/posts";
import Avatar from "@/components/Avatar";
import Post from "@/components/Post";
import Response from "@/components/Response";
import { getResponsesByUserID } from "@/lib/appwrite/responses";

export default function Profile() {
  const { id: userId } = useLocalSearchParams();

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "responses">("posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedUser = await getUserById(`${userId}`);
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
    StatusBar.setBarStyle("dark-content");
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      if (user.role === "student") {
        setUsername(user.username);
      } else {
        setUsername(`${user.surname} ${user.givenNames}`);
      }
    }
  }, [user]);

  const fetchUserContent = useCallback(async () => {
    try {
      setIsContentLoading(true);
      const fetchedPosts = await getPostsByUserID(`${userId}`);
      setPosts(fetchedPosts);
      const fetchedResponses = await getResponsesByUserID(`${userId}`);
      setResponses(fetchedResponses);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsContentLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user, activeTab, fetchUserContent]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        {/* User Profile Header */}
        <View className="p-4">
          <View className="flex-row items-center">
            <Avatar username={username} imageUrl={user?.avatar} />
            <View className="ml-4">
              <Text className="text-2xl font-bold">
                {user?.surname} {user?.givenNames}
              </Text>
              {user?.role === "student" && (
                <Text className="text-gray-500">@{user?.username}</Text>
              )}
            </View>
          </View>

          {/* Bio */}
          {user?.biography && (
            <View className="mt-4">
              <Text className="text-base">{user.biography}</Text>
            </View>
          )}

          {/* User Details */}
          <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <View className="flex-row justify-between mb-2">
              <Text className="font-medium text-gray-600">Email:</Text>
              <Text>{user?.email}</Text>
            </View>
            {user?.phoneNumber && (
              <View className="flex-row justify-between mb-2">
                <Text className="font-medium text-gray-600">Phone:</Text>
                <Text>{user.phoneNumber}</Text>
              </View>
            )}
            {user?.gender && (
              <View className="flex-row justify-between mb-2">
                <Text className="font-medium text-gray-600">Gender:</Text>
                <Text>{user.gender}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === "posts" ? "border-b-2 border-[#18392b]" : ""
            }`}
            onPress={() => setActiveTab("posts")}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "posts" ? "text-[#18392b]" : "text-gray-600"
              }`}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${
              activeTab === "responses" ? "border-b-2 border-[#18392b]" : ""
            }`}
            onPress={() => setActiveTab("responses")}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "responses" ? "text-[#18392b]" : "text-gray-600"
              }`}
            >
              Responses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View className="">
          {isContentLoading ? (
            <View className="py-8 items-center">
              <LoadingSpinner visible={true} />
            </View>
          ) : activeTab === "posts" ? (
            posts.length > 0 ? (
              posts.map((post) => <Post key={post.$id} post={post} />)
            ) : (
              <View className="py-8 items-center">
                <Text className="text-gray-500">No posts yet</Text>
              </View>
            )
          ) : responses.length > 0 ? (
            responses.map((response: ResponseModel) => (
              <Link
                key={response.$id}
                href={{
                  pathname: "/threads/[id]",
                  params: { id: `${response.postId?.$id}` },
                }}
              >
                <Response response={response} />
              </Link>
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-gray-500">No responses yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
