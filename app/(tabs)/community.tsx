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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/assets/colors/colors";

const Community = () => {
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
      {/* Uncomment and adjust the MoodLog button if needed */}
      {/*
      <TouchableOpacity
        className="bg-secondary p-3 mx-4 my-3 rounded-lg"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-white text-center font-medium">
          Log Your Mood
        </Text>
      </TouchableOpacity>
      */}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#F032DA"]}
            tintColor="#F032DA"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-lg">No posts available</Text>
          </View>
        }
      />

      {/* Uncomment the MoodLogModal if needed */}
      {/*
      <MoodLogModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          fetchPosts();
          setIsModalVisible(false);
          console.log("Mood logged successfully");
        }}
      />
      */}

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




// Recommendations


// import { FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Text, View } from "react-native";
// import React, { useEffect, useState , useCallback} from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
// import Post from "@/components/Post";
// import MoodLogModal from "@/components/MoodLog";
// import LoadingSpinner from "@/components/LoadingSpinner";

// const BATCH_SIZE = 4; // Number of recommended posts per batch
// const RECOMMENDATIONS_API = "http://192.168.31.114:8000/postRecommendations";
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes cache expiry

// const Home = () => {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [seenRecommendations, setSeenRecommendations] = useState<Set<string>>(new Set());
//   const [cachedRecommendedIds, setCachedRecommendedIds] = useState<string[]>([]);
//   const [lastRecommendationFetchTime, setLastRecommendationFetchTime] = useState<number>(0);

//   const fetchRecommendedIds = async () => {
//     try {
//       const response = await fetch(RECOMMENDATIONS_API);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("Fetched recommendations:", data);
//       return Array.isArray(data) ? data : [];
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



// _________________________________________________________


// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   GestureResponderEvent,
// } from 'react-native';

// interface ContentItem {
//   id: string;
//   title: string;
//   description: string;
//   details?: string;
// }

// // Actual dummy data for each section

// const personalizedContent: ContentItem[] = [
//   {
//     id: '1',
//     title: 'Finding Resilience',
//     description: 'Curated insights to help you navigate challenges with strength.',
//     details: 'Discover strategies that empower you to overcome obstacles and foster personal growth.',
//   },
//   {
//     id: '2',
//     title: 'Embracing Change',
//     description: 'Insights on adapting positively to life transitions.',
//     details: 'Learn how shifts in perspective can transform challenges into opportunities.',
//   },
// ];

// const mindfulEngagement: ContentItem[] = [
//   {
//     id: '1',
//     title: 'Guided Reflection',
//     description: 'Take a quiet moment for self-reflection with gentle prompts.',
//     details: 'Engage in simple exercises that help you process emotions and gain clarity.',
//   },
//   {
//     id: '2',
//     title: 'Expressive Journaling',
//     description: 'Capture your thoughts in a private, reflective space.',
//     details: 'Journaling can help you understand your feelings and track personal progress over time.',
//   },
// ];

// const emotionalBalanceTools: ContentItem[] = [
//   {
//     id: '1',
//     title: 'Grounding Exercise',
//     description: 'Practice simple techniques to help you feel centered.',
//     details: 'Use deep breathing and sensory awareness to bring yourself back to the present moment.',
//   },
//   {
//     id: '2',
//     title: 'Calming Music',
//     description: 'Enjoy a curated playlist designed to soothe and relax your mind.',
//     details: 'Let the power of music help reduce stress and improve your mood.',
//   },
// ];

// const lifestyleManagement: ContentItem[] = [
//   {
//     id: '1',
//     title: 'Meditation Practices',
//     description: 'Explore different meditation techniques for daily calm.',
//     details: 'From mindfulness to guided meditations, find what works best for you.',
//   },
//   {
//     id: '2',
//     title: 'Holistic Remedies',
//     description: 'Discover remedies such as acupuncture and aromatherapy.',
//     details: 'Learn how these approaches can contribute to a balanced mental state.',
//   },
// ];

// const Home: React.FC = () => {
//   // Helper function to render a section with cards
//   const renderSection = (sectionTitle: string, data: ContentItem[]) => (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>{sectionTitle}</Text>
//       {data.map((item: ContentItem) => (
//         <TouchableOpacity
//           key={item.id}
//           style={styles.card}
//           onPress={(event: GestureResponderEvent) => {
//             // Example: Log or navigate to a detailed view for this content item
//             console.log(`Selected: ${item.title}`);
//           }}
//         >
//           <Text style={styles.cardTitle}>{item.title}</Text>
//           <Text style={styles.cardDescription}>{item.description}</Text>
//           {item.details && <Text style={styles.cardDetails}>{item.details}</Text>}
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Discover Mental Well-Being</Text>
//       {renderSection('Personalized Content', personalizedContent)}
//       {renderSection('Mindful Engagement', mindfulEngagement)}
//       {renderSection('Emotional Balance Tools', emotionalBalanceTools)}
//       {renderSection('Lifestyle Management', lifestyleManagement)}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f7f7',
//     padding: 16,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#444',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//     color: '#222',
//   },
//   cardDescription: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 4,
//   },
//   cardDetails: {
//     fontSize: 14,
//     color: '#777',
//   },
// });

// export default Home;





// import {
//   FlatList,
//   TouchableOpacity,
//   Text,
//   View,
//   RefreshControl,
// } from "react-native";
// import React, { useEffect, useState, useCallback } from "react";
// import { getAllPostsFromDB } from "@/lib/appwrite/appwrite";
// import Post from "@/components/Post";
// import MoodLogModal from "@/components/MoodLog";
// import { SafeAreaView } from "react-native-safe-area-context";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import { Post as PostType } from "@/types"; // Assuming you have a Post type defined

// interface AnalyticsEvent {
//   type: 'dwellTime' | 'scroll' | 'postView';
//   postId: string;
//   duration?: number;
//   offsetY?: number;
//   timestamp?: number;
// }

// const Home = () => {
//   const [posts, setPosts] = useState<PostType[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const handleAnalyticsEvent = useCallback((event: AnalyticsEvent) => {
//     // Here you would send the analytics data to your backend
//     console.log('Analytics Event:', event);
//     // Example: sendToAnalyticsService(event);
//   }, []);

//   const fetchPosts = useCallback(async (showRefreshing = false) => {
//     try {
//       if (showRefreshing) {
//         setIsRefreshing(true);
//       } else {
//         setIsLoading(true);
//       }

//       const fetchedPosts = await getAllPostsFromDB();
//       setPosts(fetchedPosts);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   const handleRefresh = useCallback(() => {
//     fetchPosts(true);
//   }, [fetchPosts]);

//   const renderPost = ({ item }: { item: PostType }) => {
//     return (
//       <Post 
//         post={item} 
//         onAnalyticsEvent={handleAnalyticsEvent}
//       />
//     );
//   };

//   if (isLoading && !isRefreshing) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center">
//         <LoadingSpinner visible={true} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <View className="flex-1">
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
//         renderItem={renderPost}
//         refreshControl={
//           <RefreshControl
//             refreshing={isRefreshing}
//             onRefresh={handleRefresh}
//             colors={["#F032DA"]}
//             tintColor="#F032DA"
//           />
//         }
//         contentContainerStyle={{ paddingBottom: 20 }}
//         ListEmptyComponent={
//           <View className="flex-1 justify-center items-center mt-10">
//             <Text className="text-gray-500 text-lg">No posts available</Text>
//           </View>
//         }
//       />

//       <MoodLogModal
//         visible={isModalVisible}
//         onClose={() => setIsModalVisible(false)}
//         onSuccess={() => {
//           fetchPosts();
//           setIsModalVisible(false);
//           console.log("Mood logged successfully");
//         }}
//       />
//     </View>
//   );
// };

// export default Home;