import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { Link, useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserById } from "@/lib/appwrite/auth";
import { getPostsByUserID } from "@/lib/appwrite/posts";
import Avatar from "@/components/Avatar";
import Post from "@/components/Post";
import Response from "@/components/Response";
import { getResponsesByUserID } from "@/lib/appwrite/responses";
import { sortByCreatedAt } from "@/utils/helpers";
import {
  MaterialIcons,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BlurView } from "expo-blur"; // You may need to install this package

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 56;

export default function Profile() {
  const { id: userId } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "responses">("posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animated header values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedUser = await getUserById(`${userId}`);
      setUser(fetchedUser);
      // Animate profile card appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, fadeAnim]);

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
      const sortedPosts = sortByCreatedAt(fetchedPosts, "desc");
      setPosts(sortedPosts);
      const fetchedResponses = await getResponsesByUserID(`${userId}`);
      const sortedResponses = sortByCreatedAt(fetchedResponses, "desc");
      setResponses(sortedResponses);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsContentLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user, fetchUserContent]);

  // Handle tab change animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === "posts" ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, slideAnim]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUser();
    await fetchUserContent();
    setRefreshing(false);
  }, [fetchUser, fetchUserContent]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.25 - 40, width * 0.75 - 40],
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Animated Header */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-10 border-b border-gray-200"
        style={{
          opacity: headerOpacity,
          height: HEADER_HEIGHT,
        }}
      >
        <BlurView intensity={80} tint="light" className="absolute inset-0" />
        <View className="flex-row items-center justify-between px-4 h-full">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back-ios" size={22} color="#588b76" />
          </TouchableOpacity>

          <Text
            className="text-base font-semibold text-gray-800"
            numberOfLines={1}
          >
            {user?.role === "counselor"
              ? `${user?.surname} ${user?.givenNames}`
              : `@${user?.username}`}
          </Text>

          <TouchableOpacity
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="more-horiz" size={22} color="#588b76" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#588b76"
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Back Button on Top */}
        <View className="flex-row justify-between items-center px-4 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 bg-gray-50 rounded-full"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={22} color="#588b76" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-2 bg-gray-50 rounded-full"
            activeOpacity={0.7}
          >
            <MaterialIcons name="more-horiz" size={22} color="#588b76" />
          </TouchableOpacity>
        </View>

        {/* User Profile Card */}
        <Animated.View
          className="mx-4 mb-6 bg-white rounded-2xl overflow-hidden shadow-sm"
          style={{ opacity: fadeAnim }}
        >
          <View className="p-5">
            <View className="flex-row items-center mb-4">
              <Avatar
                username={username}
                imageUrl={user?.avatar}
                size="large"
              />
              <View className="ml-4 flex-1">
                {user?.role === "counselor" ? (
                  <Text className="text-xl font-bold text-gray-800 flex-wrap">
                    {user?.surname} {user?.givenNames}
                  </Text>
                ) : (
                  <Text className="text-xl font-bold text-gray-800">
                    @{user?.username}
                  </Text>
                )}

                <View className="flex-row items-center mt-1">
                  <Ionicons name="mail-outline" size={14} color="#6B7280" />
                  <Text
                    className="text-gray-500 text-sm ml-1"
                    numberOfLines={1}
                  >
                    {user?.email}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            {user?.biography && (
              <View className="mb-4">
                <Text className="text-base leading-6 text-gray-700">
                  {user.biography}
                </Text>
              </View>
            )}

            {/* User Details */}
            <View className="p-4 bg-gray-50 rounded-xl">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-semibold text-gray-800">
                  Profile Info
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#588b76] font-medium text-sm">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <View className="w-8 items-center justify-center">
                    <Ionicons name="mail" size={16} color="#588b76" />
                  </View>
                  <Text className="text-gray-600 w-20">Email:</Text>
                  <Text
                    className="text-gray-800 font-medium flex-1"
                    numberOfLines={1}
                  >
                    {user?.email}
                  </Text>
                </View>

                {user?.phoneNumber && (
                  <View className="flex-row items-center">
                    <View className="w-8 items-center justify-center">
                      <Ionicons name="call" size={16} color="#588b76" />
                    </View>
                    <Text className="text-gray-600 w-20">Phone:</Text>
                    <Text className="text-gray-800 font-medium">
                      {user.phoneNumber}
                    </Text>
                  </View>
                )}

                {user?.gender && (
                  <View className="flex-row items-center">
                    <View className="w-8 items-center justify-center">
                      <Ionicons name="person" size={16} color="#588b76" />
                    </View>
                    <Text className="text-gray-600 w-20">Gender:</Text>
                    <Text className="text-gray-800 font-medium">
                      {user.gender}
                    </Text>
                  </View>
                )}

                {user?.role && (
                  <View className="flex-row items-center">
                    <View className="w-8 items-center justify-center">
                      <Ionicons name="briefcase" size={16} color="#588b76" />
                    </View>
                    <Text className="text-gray-600 w-20">Role:</Text>
                    <Text className="text-gray-800 font-medium capitalize">
                      {user.role}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Activity Summary */}
          <View className="flex-row bg-gray-50 border-t border-gray-100">
            <View className="flex-1 py-3.5 items-center">
              <Text className="text-[#588b76] font-bold text-lg">
                {posts.length}
              </Text>
              <Text className="text-gray-500 text-xs uppercase tracking-wide">
                Posts
              </Text>
            </View>
            <View className="flex-1 py-3.5 items-center border-l border-gray-100">
              <Text className="text-[#588b76] font-bold text-lg">
                {responses.length}
              </Text>
              <Text className="text-gray-500 text-xs uppercase tracking-wide">
                Responses
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Content Tabs */}
        <View className="mb-1 mx-1">
          <View className="flex-row bg-white rounded-xl overflow-hidden shadow-sm">
            <TouchableOpacity
              className="flex-1 py-4 px-2"
              onPress={() => setActiveTab("posts")}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="post-outline"
                  size={18}
                  color={activeTab === "posts" ? "#588b76" : "#9CA3AF"}
                />
                <Text
                  className={
                    activeTab === "posts"
                      ? "text-[#588b76] font-bold"
                      : "text-gray-400 font-medium"
                  }
                >
                  Posts
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-4 px-2"
              onPress={() => setActiveTab("responses")}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={18}
                  color={activeTab === "responses" ? "#588b76" : "#9CA3AF"}
                />
                <Text
                  className={
                    activeTab === "responses"
                      ? "text-[#588b76] font-bold"
                      : "text-gray-400 font-medium"
                  }
                >
                  Responses
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Animated indicator */}
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              width: width / 2,
              height: 3,
              backgroundColor: "#588b76",
              borderRadius: 1.5,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width / 2],
                  }),
                },
              ],
            }}
          />
        </View>

        {/* Content Area */}
        <View className="px-1 pt-1">
          {isContentLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator color="#588b76" size="large" />
              <Text className="text-gray-500 mt-4 text-center font-medium">
                Loading {activeTab}...
              </Text>
            </View>
          ) : activeTab === "posts" ? (
            posts.length > 0 ? (
              <View className="space-y-3">
                {posts.map((post) => (
                  <View
                    key={post.$id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm mx-1"
                  >
                    <Post post={post} />
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-16 items-center bg-white mx-1 rounded-xl shadow-sm">
                <MaterialCommunityIcons
                  name="post-outline"
                  size={60}
                  color="#D1D5DB"
                />
                <Text className="text-gray-500 mt-4 text-center font-medium text-lg">
                  No posts yet
                </Text>
                <Text className="text-gray-400 mt-1 text-center mx-8">
                  Share your thoughts and ideas by creating your first post
                </Text>
                <TouchableOpacity
                  className="mt-6 bg-[#588b76] px-8 py-3 rounded-full shadow-sm"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold">Create Post</Text>
                </TouchableOpacity>
              </View>
            )
          ) : responses.length > 0 ? (
            <View className="space-y-3">
              {responses.map((response: ResponseModel) => (
                <Link
                  key={response.$id}
                  href={{
                    pathname: "/threads/[id]",
                    params: { id: `${response.postId?.$id}` },
                  }}
                  asChild
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="bg-white rounded-xl overflow-hidden shadow-sm mx-1"
                  >
                    <Response response={response} />
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          ) : (
            <View className="py-16 items-center bg-white mx-1 rounded-xl shadow-sm">
              <MaterialCommunityIcons
                name="comment-text-outline"
                size={60}
                color="#D1D5DB"
              />
              <Text className="text-gray-500 mt-4 text-center font-medium text-lg">
                No responses yet
              </Text>
              <Text className="text-gray-400 mt-1 text-center mx-8">
                Join conversations by responding to posts from the community
              </Text>
              <TouchableOpacity
                className="mt-6 bg-[#588b76] px-8 py-3 rounded-full shadow-sm"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold">Browse Discussions</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-[#588b76] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: "#588b76",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
        activeOpacity={0.8}
      >
        {activeTab === "posts" ? (
          <TouchableOpacity
            className="bg-[#588b76] w-14 h-14 rounded-full items-center justify-center shadow-lg"
            onPress={() => router.push("/create-post" as any)}
          >
            <MaterialIcons name="post-add" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-[#588b76] w-14 h-14 rounded-full items-center justify-center shadow-lg"
            onPress={() => router.push("/home" as any)}
          >
            <MaterialIcons name="comment" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
