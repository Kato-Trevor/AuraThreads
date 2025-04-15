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



// Recommendations


// import { FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Text, View } from "react-native";
// import React, { useEffect, useState , useCallback} from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
// import Post from "@/components/Post";
// import MoodLogModal from "@/components/MoodLog";
// import LoadingSpinner from "@/components/LoadingSpinner";

// const BATCH_SIZE = 4; // Number of recommended posts per batch
// const RECOMMENDATIONS_API = "http://192.168.56.114:8000/postRecommendations";
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes cache expiry

// const Home = () => {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [seenRecommendations, setSeenRecommendations] = useState<Set<string>>(new Set());
//   const [cachedRecommendedIds, setCachedRecommendedIds] = useState<string[]>([]);
//   const [lastRecommendationFetchTime, setLastRecommendationFetchTime] = useState<number>(0);

//   // const fetchRecommendedIds = async () => {
//   //   try {
//   //     const response = await fetch(RECOMMENDATIONS_API);
//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }
//   //     const data = await response.json();
//   //     console.log("Fetched recommendations:", data);
//   //     return Array.isArray(data) ? data : [];
//   //   } catch (error) {
//   //     console.error("Error fetching recommendations:", error);
//   //     return [];
//   //   }
//   // };

//   const fetchRecommendedIds = async () => {
//     try {
//       const response = await fetch(RECOMMENDATIONS_API);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Fetched recommendations:", data);
//       const arrayData = Array.isArray(data) ? data : [];
//       return arrayData.reverse(); // This reverses the array order
//     } catch (error) {
//       console.error("Error fetching recommendations:", error);
//       return [];
//     }
//   };

//   const shouldFetchRecommendations = () => {
//     // Fetch if cache is empty or expired
//     return (
//       cachedRecommendedIds.length === 0 || 
//       Date.now() - lastRecommendationFetchTime > CACHE_EXPIRY_MS
//     );
//   };

//   const processRecommendations = (allPosts: any[], recommendationIds: string[]) => {
//     // Filter out already seen recommendations
//     const newRecommendations = recommendationIds.filter(id => !seenRecommendations.has(id));
    
//     if (newRecommendations.length === 0) {
//       console.log("No new recommendations to process");
//       return;
//     }

//     const nextBatch = newRecommendations.slice(0, BATCH_SIZE);
//     console.log("Processing new batch:", nextBatch.length);

//     // Update seen recommendations
//     setSeenRecommendations(prev => {
//       const updated = new Set(prev);
//       nextBatch.forEach(id => updated.add(id));
//       return updated;
//     });

//     // Create a map for efficient lookup
//     const postMap = new Map(allPosts.map(post => [post.$id, post]));
    
//     // Get the actual post objects
//     const recommendedPosts = nextBatch
//       .map(id => postMap.get(id))
//       .filter(Boolean);

//     // Add new posts to the beginning of the list
//     setPosts(prevPosts => [...recommendedPosts, ...prevPosts]);
//   };

//   const loadPosts = async (isRefresh = false) => {
//     isRefresh ? setRefreshing(true) : setLoading(true);

//     try {
//       // Always fetch posts
//       const allPosts = await getAllPostsFromDB();
      
//       // Only fetch recommendations if needed
//       let recommendations = cachedRecommendedIds;
//       if (isRefresh || shouldFetchRecommendations()) {
//         recommendations = await fetchRecommendedIds();
//         setCachedRecommendedIds(recommendations);
//         setLastRecommendationFetchTime(Date.now());
//       }

//       processRecommendations(allPosts, recommendations);

//     } catch (error) {
//       console.error("Error loading posts:", error);
//       setPosts([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     loadPosts(true);
//   };

//   useEffect(() => {
//     loadPosts();
//   }, []);

//   if (loading && !refreshing && posts.length === 0) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1 }}>

//       <TouchableOpacity
//         className="bg-secondary p-3 mx-4 my-3 rounded-lg"
//         onPress={() => setIsModalVisible(true)}
//       >
//         <Text className="text-white text-center font-medium">
//           Log Your Mood
//         </Text>
//       </TouchableOpacity>

//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item.$id}
//         renderItem={({ item }) => <Post post={item} />}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={handleRefresh} 
//           />
//         }
//         ListEmptyComponent={
//           <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Text>No posts available</Text>
//           </View>
//         }
//         ListFooterComponent={
//           loading ? <ActivityIndicator style={{ padding: 20 }} /> : null
//         }
//         maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
//       />

//       <MoodLogModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSuccess={() => {
//           // fetchPosts();
//           setIsModalVisible(false);
//           console.log("Mood logged successfully");
//         }}
//       />
//     </SafeAreaView>
//   );
// };

// export default Home;
