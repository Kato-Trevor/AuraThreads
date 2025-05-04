import { Text, View, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
import Post from "@/components/Post";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const BATCH_SIZE = 30; // Number of recommended posts per batch
// const RECOMMENDATIONS_API = "http://192.168.74.114:8000/postRecommendations";
const RECOMMENDATIONS_API =
  "https://post-recommender.onrender.com/postRecommendations";
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes cache expiry

const Home = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seenRecommendations, setSeenRecommendations] = useState<Set<string>>(
    new Set()
  );
  const [cachedRecommendedIds, setCachedRecommendedIds] = useState<string[]>(
    []
  );
  const [lastRecommendationFetchTime, setLastRecommendationFetchTime] =
    useState<number>(0);

  const fetchRecommendedIds = async () => {
    try {
      const response = await fetch(RECOMMENDATIONS_API);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched recommendations:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  };


  const shouldFetchRecommendations = () => {
    // Fetch if cache is empty or expired
    return (
      cachedRecommendedIds.length === 0 ||
      Date.now() - lastRecommendationFetchTime > CACHE_EXPIRY_MS
    );
  };

  const processRecommendations = (
    allPosts: any[],
    recommendationIds: string[]
  ) => {
    // Filter out already seen recommendations
    const newRecommendations = recommendationIds.filter(
      (id) => !seenRecommendations.has(id)
    );

    if (newRecommendations.length === 0) {
      console.log("No new recommendations to process");
      return;
    }

    const nextBatch = newRecommendations.slice(0, BATCH_SIZE);
    console.log("Processing new batch:", nextBatch.length);

    // Update seen recommendations
    setSeenRecommendations((prev) => {
      const updated = new Set(prev);
      nextBatch.forEach((id) => updated.add(id));
      return updated;
    });

    // Create a map for efficient lookup
    const postMap = new Map(allPosts.map((post) => [post.$id, post]));

    // Get the actual post objects
    const recommendedPosts = nextBatch
      .map((id) => postMap.get(id))
      .filter(Boolean);

    // Add new posts to the beginning of the list
    setPosts((prevPosts) => [...recommendedPosts, ...prevPosts]);
  };

  const loadPosts = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);

    try {
      // Always fetch posts
      const allPosts = await getAllPostsFromDB();

      // Only fetch recommendations if needed
      let recommendations = cachedRecommendedIds;
      if (isRefresh || shouldFetchRecommendations()) {
        recommendations = await fetchRecommendedIds();
        setCachedRecommendedIds(recommendations);
        setLastRecommendationFetchTime(Date.now());
      }

      processRecommendations(allPosts, recommendations);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadPosts(true);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading && !refreshing && posts.length === 0) {
    return (
      
      <View className="flex-1 justify-start items-center bg-white pt-40">
        <ActivityIndicator size={40} color="#1e4635" />
        <Text className="font-pregular mt-4 text-secondary-dark text-center">
          Fetching Posts...
        </Text>
      </View>
    );
  }

  const renderPost = ({ item }: { item: any }) => {
    return <Post post={item} />;
  };

  return (
    <View  className=" flex-1 bg-white">
      <FlatList
        style={{ backgroundColor: 'white' }}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#588b76"]}
            tintColor="#588b76"
          />
        }
        contentContainerStyle={{ paddingBottom: 20, backgroundColor: 'white' }}
        ListEmptyComponent={
          <View className="justify-center items-center p-8 bg-white">
            <View className="bg-secondary-100/30 p-4 rounded-full">
              <Feather name="message-circle" size={36} color="#1e4635" />
            </View>
            <Text className="font-pregular mt-4 text-secondary-dark text-center">
              No posts available. Click the '+' button to create a post!
            </Text>
          </View>
        }
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#588b76',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2.84,
          elevation: 5,
        }}

        onPress={() => router.push("/create-post")}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

