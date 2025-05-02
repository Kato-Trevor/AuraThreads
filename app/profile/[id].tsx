// import {
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Animated,
//   RefreshControl,
//   Dimensions,
//   StatusBar,
//   Platform,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { Link, useLocalSearchParams, router } from "expo-router";
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import LoadingSpinner from "@/components/LoadingSpinner";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getUserById } from "@/lib/appwrite/auth";
// import { getPostsByUserID } from "@/lib/appwrite/posts";
// import Avatar from "@/components/Avatar";
// import Post from "@/components/Post";
// import Response from "@/components/Response";
// import { getResponsesByUserID } from "@/lib/appwrite/responses";
// import { sortByCreatedAt } from "@/utils/helpers";
// import {
//   MaterialIcons,
//   Ionicons,
//   Feather,
//   MaterialCommunityIcons,
// } from "@expo/vector-icons";
// import { BlurView } from "expo-blur";
// import { LinearGradient } from "expo-linear-gradient";

// const { width } = Dimensions.get("window");
// const HEADER_HEIGHT = 56;

// export default function Profile() {
//   const { id: userId } = useLocalSearchParams();
//   const scrollY = useRef(new Animated.Value(0)).current;

//   const [user, setUser] = useState<any>(null);
//   const [username, setUsername] = useState<any>(null);
//   const [activeTab, setActiveTab] = useState<"posts" | "responses">("posts");
//   const [posts, setPosts] = useState<any[]>([]);
//   const [responses, setResponses] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isContentLoading, setIsContentLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;

//   // Animated header values
//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100],
//     outputRange: [0, 1],
//     extrapolate: "clamp",
//   });

//   const fetchUser = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const fetchedUser = await getUserById(`${userId}`);
//       setUser(fetchedUser);
//       // Animate profile card appearance
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }).start();
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userId, fadeAnim]);

//   useEffect(() => {
//     fetchUser();
//     StatusBar.setBarStyle("dark-content");
//   }, [fetchUser]);

//   useEffect(() => {
//     if (user) {
//       if (user.role === "student") {
//         setUsername(user.username);
//       } else {
//         setUsername(`${user.surname} ${user.givenNames}`);
//       }
//     }
//   }, [user]);

//   const fetchUserContent = useCallback(async () => {
//     try {
//       setIsContentLoading(true);
//       const fetchedPosts = await getPostsByUserID(`${userId}`);
//       const sortedPosts = sortByCreatedAt(fetchedPosts, "desc");
//       setPosts(sortedPosts);
//       const fetchedResponses = await getResponsesByUserID(`${userId}`);
//       const sortedResponses = sortByCreatedAt(fetchedResponses, "desc");
//       setResponses(sortedResponses);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setIsContentLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (user) {
//       fetchUserContent();
//     }
//   }, [user, fetchUserContent]);

//   // Handle tab change animation
//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: activeTab === "posts" ? 0 : 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [activeTab, slideAnim]);

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchUser();
//     await fetchUserContent();
//     setRefreshing(false);
//   }, [fetchUser, fetchUserContent]);

//   const translateX = slideAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [width * 0.25 - 40, width * 0.75 - 40],
//   });

//   if (isLoading) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-white">
//         <LoadingSpinner visible={true} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
//       {/* Animated Header */}
//       <Animated.View
//         className="absolute top-0 left-0 right-0 z-10 border-b border-gray-200"
//         style={{
//           opacity: headerOpacity,
//           height: HEADER_HEIGHT,
//         }}
//       >
//         <BlurView intensity={80} tint="light" className="absolute inset-0" />
//         <View className="flex-row items-center justify-between px-4 h-full">
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className="p-2 bg-white/60 rounded-full"
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <MaterialIcons name="arrow-back-ios" size={18} color="#18392b" />
//           </TouchableOpacity>

//           <Text
//             className="text-base font-['Poppins-SemiBold'] text-gray-800"
//             numberOfLines={1}
//           >
//             {user?.role === "counselor"
//               ? `${user?.surname} ${user?.givenNames}`
//               : `@${user?.username}`}
//           </Text>

//           <TouchableOpacity
//             className="p-2 bg-white/60 rounded-full"
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <MaterialIcons name="more-horiz" size={18} color="#18392b" />
//           </TouchableOpacity>
//         </View>
//       </Animated.View>

//       <Animated.ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#18392b"
//           />
//         }
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         scrollEventThrottle={16}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       >
//         <View className="p-3">
//           {/* Header with Gradient */}
//           <LinearGradient
//             colors={["#18392b", "#2a5745"]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             className="rounded-2xl mb-5 p-5"
//           >
//             <View className="flex-row items-center">
//               <TouchableOpacity
//                 onPress={() => {
//                   router.back();
//                 }}
//                 className="bg-white/20 w-10 h-10 rounded-full items-center justify-center"
//               >
//                 <Ionicons name="chevron-back" size={24} color="#fff" />
//               </TouchableOpacity>
//               <Text className="font-['Poppins-SemiBold'] text-2xl text-white ml-4">
//                 Profile
//               </Text>
//             </View>
//           </LinearGradient>
//         </View>

//         {/* User Profile Card */}
//         <Animated.View
//           className="mx-4 mb-6 bg-white rounded-2xl overflow-hidden shadow-md"
//           style={{ opacity: fadeAnim }}
//         >
//           <View className="p-5">
//             <View className="flex-row items-center mb-5">
//               <View className="h-20 w-20 bg-white/20 rounded-full justify-center items-center border-4 border-white shadow-sm">
//                 <Avatar
//                   username={username}
//                   imageUrl={user?.avatar}
//                   size="large"
//                 />
//               </View>
//               <View className="ml-4 flex-1">
//                 {user?.role === "counselor" ? (
//                   <Text className="text-xl font-['Poppins-Bold'] text-gray-800 flex-wrap">
//                     {user?.surname} {user?.givenNames}
//                   </Text>
//                 ) : (
//                   <Text className="text-xl font-['Poppins-Bold'] text-gray-800">
//                     @{user?.username}
//                   </Text>
//                 )}

//                 <View className="flex-row items-center mt-1">
//                   <View className="bg-green-50 p-1 rounded-full">
//                     <Ionicons name="mail-outline" size={12} color="#18392b" />
//                   </View>
//                   <Text
//                     className="text-gray-500 text-sm ml-1 font-['Poppins-Regular']"
//                     numberOfLines={1}
//                   >
//                     {user?.email}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Bio */}
//             {user?.biography && (
//               <View className="mb-5">
//                 <Text className="text-base leading-6 text-gray-700 font-['Poppins-Regular']">
//                   {user.biography}
//                 </Text>
//               </View>
//             )}

//             {/* User Details */}
//             <View className="p-4 bg-gray-50 rounded-xl">
//               <View className="flex-row justify-between items-center mb-4">
//                 <Text className="font-['Poppins-SemiBold'] text-gray-800">
//                   Profile Info
//                 </Text>
//                 <TouchableOpacity className="bg-green-50 px-3 py-1 rounded-full">
//                   <Text className="text-[#18392b] font-['Poppins-Medium'] text-sm">
//                     Edit
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <View className="space-y-3">
//                 <View className="flex-row items-center">
//                   <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
//                     <Ionicons name="mail" size={16} color="#18392b" />
//                   </View>
//                   <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
//                     Email:
//                   </Text>
//                   <Text
//                     className="text-gray-800 font-['Poppins-Medium'] flex-1"
//                     numberOfLines={1}
//                   >
//                     {user?.email}
//                   </Text>
//                 </View>

//                 {user?.phoneNumber && (
//                   <View className="flex-row items-center">
//                     <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
//                       <Ionicons name="call" size={16} color="#18392b" />
//                     </View>
//                     <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
//                       Phone:
//                     </Text>
//                     <Text className="text-gray-800 font-['Poppins-Medium']">
//                       {user.phoneNumber}
//                     </Text>
//                   </View>
//                 )}

//                 {user?.gender && (
//                   <View className="flex-row items-center">
//                     <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
//                       <Ionicons name="person" size={16} color="#18392b" />
//                     </View>
//                     <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
//                       Gender:
//                     </Text>
//                     <Text className="text-gray-800 font-['Poppins-Medium']">
//                       {user.gender}
//                     </Text>
//                   </View>
//                 )}

//                 {user?.role && (
//                   <View className="flex-row items-center">
//                     <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
//                       <Ionicons name="briefcase" size={16} color="#18392b" />
//                     </View>
//                     <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
//                       Role:
//                     </Text>
//                     <Text className="text-gray-800 font-['Poppins-Medium'] capitalize">
//                       {user.role}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           </View>

//           {/* Activity Summary */}
//           <LinearGradient
//             colors={["#f9f9f9", "#f3f4f6"]}
//             className="flex-row border-t border-gray-100"
//           >
//             <View className="flex-1 py-4 items-center">
//               <Text className="text-[#18392b] font-['Poppins-Bold'] text-lg">
//                 {posts.length}
//               </Text>
//               <Text className="text-gray-500 text-xs uppercase tracking-wide font-['Poppins-Medium']">
//                 Posts
//               </Text>
//             </View>
//             <View className="flex-1 py-4 items-center border-l border-gray-100">
//               <Text className="text-[#18392b] font-['Poppins-Bold'] text-lg">
//                 {responses.length}
//               </Text>
//               <Text className="text-gray-500 text-xs uppercase tracking-wide font-['Poppins-Medium']">
//                 Responses
//               </Text>
//             </View>
//           </LinearGradient>
//         </Animated.View>

//         {/* Content Tabs */}
//         <View className="mx-4 mb-4">
//           <View className="flex-row bg-white rounded-xl overflow-hidden shadow-sm">
//             <TouchableOpacity
//               className={`flex-1 py-4 px-2 ${
//                 activeTab === "posts" ? "bg-green-50" : ""
//               }`}
//               onPress={() => setActiveTab("posts")}
//               activeOpacity={0.7}
//             >
//               <View className="flex-row items-center justify-center space-x-2">
//                 <MaterialCommunityIcons
//                   name="post-outline"
//                   size={18}
//                   color={activeTab === "posts" ? "#18392b" : "#9CA3AF"}
//                 />
//                 <Text
//                   className={
//                     activeTab === "posts"
//                       ? "text-[#18392b] font-['Poppins-Bold']"
//                       : "text-gray-400 font-['Poppins-Medium']"
//                   }
//                 >
//                   Posts
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               className={`flex-1 py-4 px-2 ${
//                 activeTab === "responses" ? "bg-green-50" : ""
//               }`}
//               onPress={() => setActiveTab("responses")}
//               activeOpacity={0.7}
//             >
//               <View className="flex-row items-center justify-center space-x-2">
//                 <MaterialCommunityIcons
//                   name="comment-text-outline"
//                   size={18}
//                   color={activeTab === "responses" ? "#18392b" : "#9CA3AF"}
//                 />
//                 <Text
//                   className={
//                     activeTab === "responses"
//                       ? "text-[#18392b] font-['Poppins-Bold']"
//                       : "text-gray-400 font-['Poppins-Medium']"
//                   }
//                 >
//                   Responses
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Content Area */}
//         <View className="px-4">
//           {isContentLoading ? (
//             <View className="py-10 items-center bg-white rounded-2xl shadow-sm">
//               <ActivityIndicator color="#18392b" size="large" />
//               <Text className="text-gray-500 mt-4 text-center font-['Poppins-Medium']">
//                 Loading {activeTab}...
//               </Text>
//             </View>
//           ) : activeTab === "posts" ? (
//             posts.length > 0 ? (
//               <View className="space-y-4">
//                 {posts.map((post) => (
//                   <View
//                     key={post.$id}
//                     className="bg-white rounded-2xl overflow-hidden shadow-sm"
//                   >
//                     <Post post={post} />
//                   </View>
//                 ))}
//               </View>
//             ) : (
//               <View className="py-16 items-center bg-white rounded-2xl shadow-sm">
//                 <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
//                   <MaterialCommunityIcons
//                     name="post-outline"
//                     size={40}
//                     color="#9CA3AF"
//                   />
//                 </View>
//                 <Text className="text-gray-700 font-['Poppins-SemiBold'] text-lg">
//                   No posts yet
//                 </Text>
//                 <Text className="text-gray-500 mt-2 text-center mx-8 font-['Poppins-Regular']">
//                   Share your thoughts and ideas by creating your first post
//                 </Text>
//                 <TouchableOpacity
//                   className="mt-6 bg-[#18392b] px-8 py-3 rounded-full shadow-sm"
//                   activeOpacity={0.8}
//                 >
//                   <Text className="text-white font-['Poppins-SemiBold']">
//                     Create Post
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )
//           ) : responses.length > 0 ? (
//             <View className="space-y-4">
//               {responses.map((response: ResponseModel) => (
//                 <Link
//                   key={response.$id}
//                   href={{
//                     pathname: "/threads/[id]",
//                     params: { id: `${response.postId?.$id}` },
//                   }}
//                   asChild
//                 >
//                   <TouchableOpacity
//                     activeOpacity={0.7}
//                     className="bg-white rounded-2xl overflow-hidden shadow-sm"
//                   >
//                     <Response response={response} />
//                   </TouchableOpacity>
//                 </Link>
//               ))}
//             </View>
//           ) : (
//             <View className="py-16 items-center bg-white rounded-2xl shadow-sm">
//               <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
//                 <MaterialCommunityIcons
//                   name="comment-text-outline"
//                   size={40}
//                   color="#9CA3AF"
//                 />
//               </View>
//               <Text className="text-gray-700 font-['Poppins-SemiBold'] text-lg">
//                 No responses yet
//               </Text>
//               <Text className="text-gray-500 mt-2 text-center mx-8 font-['Poppins-Regular']">
//                 Join conversations by responding to posts from the community
//               </Text>
//               <TouchableOpacity
//                 className="mt-6 bg-[#18392b] px-8 py-3 rounded-full shadow-sm"
//                 activeOpacity={0.8}
//               >
//                 <Text className="text-white font-['Poppins-SemiBold']">
//                   Browse Discussions
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </Animated.ScrollView>

//       {/* Action Button */}
//       <TouchableOpacity
//         className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
//         style={{
//           shadowColor: "#18392b",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.3,
//           shadowRadius: 6,
//           elevation: 8,
//         }}
//         activeOpacity={0.8}
//       >
//         <LinearGradient
//           colors={["#18392b", "#2a5745"]}
//           className="w-14 h-14 rounded-full items-center justify-center"
//         >
//           {activeTab === "posts" ? (
//             <TouchableOpacity
//               className="w-full h-full rounded-full items-center justify-center"
//               onPress={() => router.push("/create-post" as any)}
//             >
//               <MaterialIcons name="post-add" size={26} color="#FFFFFF" />
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               className="w-full h-full rounded-full items-center justify-center"
//               onPress={() => router.push("/home" as any)}
//             >
//               <MaterialIcons name="comment" size={24} color="#FFFFFF" />
//             </TouchableOpacity>
//           )}
//         </LinearGradient>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }



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
import { getPostsByUserID, getPostsByTopic } from "@/lib/appwrite/posts";
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
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 56;

export default function Profile() {
  const { id: userId } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;

  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "responses" | "urgent">("posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [harmfulPosts, setHarmfulPosts] = useState<any[]>([]);
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
      
      // Only fetch harmful posts if user is a counselor
      if (user?.role === "counselor") {
        const fetchedHarmfulPosts = await getPostsByTopic("SelfHarm");
        const sortedHarmfulPosts = sortByCreatedAt(fetchedHarmfulPosts, "desc");
        setHarmfulPosts(sortedHarmfulPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsContentLoading(false);
    }
  }, [userId, user?.role]);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user, fetchUserContent]);

  // Handle tab change animation
  useEffect(() => {
    let toValue;
    if (activeTab === "posts") {
      toValue = 0;
    } else if (activeTab === "responses") {
      toValue = 1;
    } else {
      toValue = 2;
    }
    
    Animated.timing(slideAnim, {
      toValue,
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
    inputRange: [0, 1, 2],
    outputRange: [
      width * (user?.role === "counselor" ? 0.166 : 0.25) - 40,
      width * (user?.role === "counselor" ? 0.5 : 0.75) - 40,
      width * 0.833 - 40
    ],
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
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
            className="p-2 bg-white/60 rounded-full"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color="#18392b" />
          </TouchableOpacity>

          <Text
            className="text-base font-['Poppins-SemiBold'] text-gray-800"
            numberOfLines={1}
          >
            {user?.role === "counselor"
              ? `${user?.surname} ${user?.givenNames}`
              : `@${user?.username}`}
          </Text>

          <TouchableOpacity
            className="p-2 bg-white/60 rounded-full"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="more-horiz" size={18} color="#18392b" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#18392b"
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
        <View className="p-3">
          {/* Header with Gradient */}
          <LinearGradient
            colors={["#18392b", "#2a5745"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-2xl mb-5 p-5"
          >
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                className="bg-white/20 w-10 h-10 rounded-full items-center justify-center"
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text className="font-['Poppins-SemiBold'] text-2xl text-white ml-4">
                Profile
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* User Profile Card */}
        <Animated.View
          className="mx-4 mb-6 bg-white rounded-2xl overflow-hidden shadow-md"
          style={{ opacity: fadeAnim }}
        >
          <View className="p-5">
            <View className="flex-row items-center mb-5">
              <View className="h-20 w-20 bg-white/20 rounded-full justify-center items-center border-4 border-white shadow-sm">
                <Avatar
                  username={username}
                  imageUrl={user?.avatar}
                  size="large"
                />
              </View>
              <View className="ml-4 flex-1">
                {user?.role === "counselor" ? (
                  <Text className="text-xl font-['Poppins-Bold'] text-gray-800 flex-wrap">
                    {user?.surname} {user?.givenNames}
                  </Text>
                ) : (
                  <Text className="text-xl font-['Poppins-Bold'] text-gray-800">
                    @{user?.username}
                  </Text>
                )}

                <View className="flex-row items-center mt-1">
                  <View className="bg-green-50 p-1 rounded-full">
                    <Ionicons name="mail-outline" size={12} color="#18392b" />
                  </View>
                  <Text
                    className="text-gray-500 text-sm ml-1 font-['Poppins-Regular']"
                    numberOfLines={1}
                  >
                    {user?.email}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            {user?.biography && (
              <View className="mb-5">
                <Text className="text-base leading-6 text-gray-700 font-['Poppins-Regular']">
                  {user.biography}
                </Text>
              </View>
            )}

            {/* User Details */}
            <View className="p-4 bg-gray-50 rounded-xl">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="font-['Poppins-SemiBold'] text-gray-800">
                  Profile Info
                </Text>
                <TouchableOpacity className="bg-green-50 px-3 py-1 rounded-full">
                  <Text className="text-[#18392b] font-['Poppins-Medium'] text-sm">
                    Edit
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
                    <Ionicons name="mail" size={16} color="#18392b" />
                  </View>
                  <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
                    Email:
                  </Text>
                  <Text
                    className="text-gray-800 font-['Poppins-Medium'] flex-1"
                    numberOfLines={1}
                  >
                    {user?.email}
                  </Text>
                </View>

                {user?.phoneNumber && (
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
                      <Ionicons name="call" size={16} color="#18392b" />
                    </View>
                    <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
                      Phone:
                    </Text>
                    <Text className="text-gray-800 font-['Poppins-Medium']">
                      {user.phoneNumber}
                    </Text>
                  </View>
                )}

                {user?.gender && (
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
                      <Ionicons name="person" size={16} color="#18392b" />
                    </View>
                    <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
                      Gender:
                    </Text>
                    <Text className="text-gray-800 font-['Poppins-Medium']">
                      {user.gender}
                    </Text>
                  </View>
                )}

                {user?.role && (
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-green-50 rounded-full items-center justify-center">
                      <Ionicons name="briefcase" size={16} color="#18392b" />
                    </View>
                    <Text className="text-gray-600 w-20 ml-3 font-['Poppins-Regular']">
                      Role:
                    </Text>
                    <Text className="text-gray-800 font-['Poppins-Medium'] capitalize">
                      {user.role}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Activity Summary */}
          <LinearGradient
            colors={["#f9f9f9", "#f3f4f6"]}
            className="flex-row border-t border-gray-100"
          >
            <View className="flex-1 py-4 items-center">
              <Text className="text-[#18392b] font-['Poppins-Bold'] text-lg">
                {posts.length}
              </Text>
              <Text className="text-gray-500 text-xs uppercase tracking-wide font-['Poppins-Medium']">
                Posts
              </Text>
            </View>
            <View className="flex-1 py-4 items-center border-l border-gray-100">
              <Text className="text-[#18392b] font-['Poppins-Bold'] text-lg">
                {responses.length}
              </Text>
              <Text className="text-gray-500 text-xs uppercase tracking-wide font-['Poppins-Medium']">
                Responses
              </Text>
            </View>
            {user?.role === "counselor" && (
              <View className="flex-1 py-4 items-center border-l border-gray-100">
                <Text className="text-[#18392b] font-['Poppins-Bold'] text-lg">
                  {harmfulPosts.length}
                </Text>
                <Text className="text-gray-500 text-xs uppercase tracking-wide font-['Poppins-Medium']">
                  Urgent
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Content Tabs */}
        <View className="mx-4 mb-4">
          <View className="flex-row bg-white rounded-xl overflow-hidden shadow-sm">
            <TouchableOpacity
              className={`flex-1 py-4 px-2 ${
                activeTab === "posts" ? "bg-green-50" : ""
              }`}
              onPress={() => setActiveTab("posts")}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="post-outline"
                  size={18}
                  color={activeTab === "posts" ? "#18392b" : "#9CA3AF"}
                />
                <Text
                  className={
                    activeTab === "posts"
                      ? "text-[#18392b] font-['Poppins-Bold']"
                      : "text-gray-400 font-['Poppins-Medium']"
                  }
                >
                  Posts
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-4 px-2 ${
                activeTab === "responses" ? "bg-green-50" : ""
              }`}
              onPress={() => setActiveTab("responses")}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center space-x-2">
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={18}
                  color={activeTab === "responses" ? "#18392b" : "#9CA3AF"}
                />
                <Text
                  className={
                    activeTab === "responses"
                      ? "text-[#18392b] font-['Poppins-Bold']"
                      : "text-gray-400 font-['Poppins-Medium']"
                  }
                >
                  Responses
                </Text>
              </View>
            </TouchableOpacity>

            {user?.role === "counselor" && (
              <TouchableOpacity
                className={`flex-1 py-4 px-2 ${
                  activeTab === "urgent" ? "bg-green-50" : ""
                }`}
                onPress={() => setActiveTab("urgent")}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center justify-center space-x-2">
                  <MaterialCommunityIcons
                    name="alert-octagon-outline"
                    size={18}
                    color={activeTab === "urgent" ? "#18392b" : "#9CA3AF"}
                  />
                  <Text
                    className={
                      activeTab === "urgent"
                        ? "text-[#18392b] font-['Poppins-Bold']"
                        : "text-gray-400 font-['Poppins-Medium']"
                    }
                  >
                    Urgent
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Content Area */}
        <View className="px-4">
          {isContentLoading ? (
            <View className="py-10 items-center bg-white rounded-2xl shadow-sm">
              <ActivityIndicator color="#18392b" size="large" />
              <Text className="text-gray-500 mt-4 text-center font-['Poppins-Medium']">
                Loading {activeTab}...
              </Text>
            </View>
          ) : activeTab === "posts" ? (
            posts.length > 0 ? (
              <View className="space-y-4">
                {posts.map((post) => (
                  <View
                    key={post.$id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <Post post={post} />
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-16 items-center bg-white rounded-2xl shadow-sm">
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <MaterialCommunityIcons
                    name="post-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                </View>
                <Text className="text-gray-700 font-['Poppins-SemiBold'] text-lg">
                  No posts yet
                </Text>
                <Text className="text-gray-500 mt-2 text-center mx-8 font-['Poppins-Regular']">
                  Share your thoughts and ideas by creating your first post
                </Text>
                <TouchableOpacity
                  className="mt-6 bg-[#18392b] px-8 py-3 rounded-full shadow-sm"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-['Poppins-SemiBold']">
                    Create Post
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : activeTab === "responses" ? (
            responses.length > 0 ? (
              <View className="space-y-4">
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
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      <Response response={response} />
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            ) : (
              <View className="py-16 items-center bg-white rounded-2xl shadow-sm">
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <MaterialCommunityIcons
                    name="comment-text-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                </View>
                <Text className="text-gray-700 font-['Poppins-SemiBold'] text-lg">
                  No responses yet
                </Text>
                <Text className="text-gray-500 mt-2 text-center mx-8 font-['Poppins-Regular']">
                  Join conversations by responding to posts from the community
                </Text>
                <TouchableOpacity
                  className="mt-6 bg-[#18392b] px-8 py-3 rounded-full shadow-sm"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-['Poppins-SemiBold']">
                    Browse Discussions
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : harmfulPosts.length > 0 ? (
            <View className="space-y-4">
              {harmfulPosts.map((post) => (
                <View
                  key={post.$id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <Post post={post} />
                </View>
              ))}
            </View>
          ) : (
            <View className="py-16 items-center bg-white rounded-2xl shadow-sm">
              <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                <MaterialCommunityIcons
                  name="alert-octagon-outline"
                  size={40}
                  color="#9CA3AF"
                />
              </View>
              <Text className="text-gray-700 font-['Poppins-SemiBold'] text-lg">
                No urgent posts found
              </Text>
              <Text className="text-gray-500 mt-2 text-center mx-8 font-['Poppins-Regular']">
                There are currently no posts flagged as self-harm
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={{
          shadowColor: "#18392b",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#18392b", "#2a5745"]}
          className="w-14 h-14 rounded-full items-center justify-center"
        >
          {activeTab === "posts" ? (
            <TouchableOpacity
              className="w-full h-full rounded-full items-center justify-center"
              onPress={() => router.push("/create-post" as any)}
            >
              <MaterialIcons name="post-add" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          ) : activeTab === "responses" ? (
            <TouchableOpacity
              className="w-full h-full rounded-full items-center justify-center"
              onPress={() => router.push("/home" as any)}
            >
              <MaterialIcons name="comment" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="w-full h-full rounded-full items-center justify-center"
              onPress={() => router.push("/home" as any)}
            >
              <MaterialIcons name="comment" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

