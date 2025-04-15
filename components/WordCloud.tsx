// import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
// import React, { useRef, useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TagCloud } from "react-tagcloud/rn";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import { 
//   getExperiencePostsByTopic,
//   getExperienceResponsesByTopic,
//   getExperiencePosts,
//   getExperienceResponses,
//   getPostById
// } from "@/lib/appwrite/appwrite";
// import { formatTopic } from "@/utils/stringHelpers";

// type TagItem = {
//   value: string;
//   count: number;
// };

// type ContentItem = {
//   id: string;
//   content: string;
// };

// const WordCloud = () => {
//   const bottomSheetRef = useRef<BottomSheet | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [contentItems, setContentItems] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState({
//     tags: true,
//     content: false,
//   });
//   const [tags, setTags] = useState<TagItem[]>([]);

//   useEffect(() => {
//     const fetchExperienceTopics = async () => {
//       try {
//         // Fetch all experience posts and responses to generate the word cloud
//         const [experiencePosts, experienceResponses] = await Promise.all([
//           getExperiencePosts(),
//           getExperienceResponses()
//         ]);

//       //  // Temporary test
//       //     const test = async () => {
//       //       const results = await getExperienceResponsesByTopic("None");
//       //       console.log('TEST RESULTS:', results);
//       //     };
//       //     test();

//         // Create a map to count topic occurrences
//         const topicMap = new Map<string, number>();

//         // Process posts
//         experiencePosts.forEach(post => {
//           const count = topicMap.get(post.topic) || 0;
//           topicMap.set(post.topic, count + 1);
//         });

//         // Process responses (need to get their associated posts' topics)
//         const responsePosts = await Promise.all(
//           experienceResponses.map(response => 
//             getPostById(response.postId).catch(() => null)
//           )
//         );

//         responsePosts.forEach(post => {
//           if (post) {
//             const count = topicMap.get(post.topic) || 0;
//             topicMap.set(post.topic, count + 1);
//           }
//         });

//         // Convert to TagItem array
//         const tagsArray = Array.from(topicMap.entries()).map(([value, count]) => ({
//           value: formatTopic(value),
//           count
//         }));

//         setTags(tagsArray);
//       } catch (error) {
//         console.error("Error fetching experience topics:", error);
//       } finally {
//         setLoading(prev => ({ ...prev, tags: false }));
//       }
//     };

//     fetchExperienceTopics();
//   }, []);

//   const handleTagPress = async (tag: { value: string }) => {
//     setSelectedTag(tag.value);
//     setLoading(prev => ({ ...prev, content: true }));
//     setContentItems([]);

//     try {
//       // Fetch both posts and responses for the selected topic
//       const [posts, responses] = await Promise.all([
//         getExperiencePostsByTopic(tag.value),
//         getExperienceResponsesByTopic(tag.value)
//       ]);

//       // Combine and format the content
//       const combinedContent = [
//         ...posts.map(post => ({
//           id: post.$id,
//           content: post.content
//         })),
//         ...responses.map(response => ({
//           id: response.$id,
//           content: response.content
//         }))
//       ];

//       setContentItems(combinedContent);
//     } catch (error) {
//       console.error("Error fetching experiences:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, content: false }));
//       bottomSheetRef.current?.expand();
//     }
//   };

//   return (
//     <GestureHandlerRootView className="flex-1">
//       <SafeAreaView className="flex-1">
//         {loading.tags ? (
//           <View className="flex-1 justify-center items-center">
//             <ActivityIndicator size="large" />
//           </View>
//         ) : (
//           <>
//             <View className="m-2 items-center justify-center">
//               <TagCloud
//                 minSize={12}
//                 maxSize={35}
//                 tags={tags}
//                 disableRandomColor={false}
//                 onPress={handleTagPress}
//                 shuffle={false}
//               />
//               <Text className="mt-20 text-gray-500 text-sm">
//                 Tap any word from the cloud
//               </Text>
//             </View>

//             <BottomSheet
//               ref={bottomSheetRef}
//               index={-1}
//               snapPoints={["40%", "75%"]}
//               enablePanDownToClose={true}
//             >
//               <BottomSheetScrollView
//                 contentContainerStyle={styles.contentContainer}
//               >
//                 <Text className="text-lg font-bold mb-4">
//                   Shared Experiences
//                 </Text>

//                 {loading.content ? (
//                   <ActivityIndicator size="large" />
//                 ) : contentItems.length > 0 ? (
//                   contentItems.map((item) => (
//                     <View
//                       key={item.id}
//                       className="mb-4 p-3 bg-gray-100 rounded-lg"
//                     >
//                       <Text className="text-sm">{item.content}</Text>
//                     </View>
//                   ))
//                 ) : selectedTag ? (
//                   <Text className="text-gray-500">
//                     No shared experiences found for {selectedTag}
//                   </Text>
//                 ) : (
//                   <Text className="text-gray-500">
//                     Select a tag to view shared experiences
//                   </Text>
//                 )}
//               </BottomSheetScrollView>
//             </BottomSheet>
//           </>
//         )}
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default WordCloud;

// const styles = StyleSheet.create({
//   contentContainer: {
//     padding: 20,
//   },
// });


























// import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
// import React, { useRef, useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TagCloud } from "react-tagcloud/rn";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import { getPostById, getResponseById } from "@/lib/appwrite/appwrite";
// import { topics } from "@/constants/constants";
// import { formatTopic } from "@/utils/stringHelpers";

// type TagItem = {
//   value: string;
//   count: number;
// };

// type ContentItem = {
//   id: string;
//   content: string;
// };

// const WordCloud = () => {
//   const bottomSheetRef = useRef<BottomSheet | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [contentItems, setContentItems] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState({
//     tags: true,
//     content: false,
//   });
//   const [tags, setTags] = useState<TagItem[]>([]);
//   const [allTags, setAllTags] = useState<TagItem[]>([]);

//   const mockData = {
//     posts: [
//       { $id: "67eab8e20039505af549", topic: "ExamAnxiety" },
//       { $id: "67eab5a400189f496785", topic: "Loneliness" },
//       { $id: "67e94ebf002486771cfc", topic: "CampusLife" },
//       { $id: "67e82ade00131e7d7efc", topic: "Burnout" },
//       { $id: "67e58d86000469718873", topic: "MentalHealth" },
//       { $id: "67e58d0d001ae1a867cd", topic: "SocialPressure" },
//       { $id: "67e5840e000e7a7a936b", topic: "RoommateIssues" },
//       { $id: "67e57cea0028a2116d8c", topic: "CareerUncertainty" },
//       { $id: "67e3d1480037f5c8d935", topic: "SocialPressure" },
//       { $id: "67e3d0fa002c389666a0", topic: "TimeManagement" },
//     ],
//     responses: [
//       { $id: "67eb8aaa003b497fa712", topic: "RoommateIssues" },
//       { $id: "67eb8a70000505ece74b", topic: "MentalHealth" },
//       { $id: "67eb8a68003869ca4b20", topic: "MentalHealth" },
//       { $id: "67eb8a1c001145a53af6", topic: "Burnout" },
//       { $id: "67eb89ec001b007d471c", topic: "CampusLife" },
//       { $id: "67eb89e900101be07492", topic: "CampusLife" },
//       { $id: "67eb872b002aa77afb90", topic: "Loneliness" },
//       { $id: "67eb86f30014223bbbea", topic: "ExamAnxiety" },
//       { $id: "67eb856c002167f83d36", topic: "ExamAnxiety" },
//       { $id: "67eb854f002c3444ba14", topic: "ExamAnxiety" },
//     ],
//   };

//   useEffect(() => {
//     const allPossibleTags = topics.map((topic) => ({
//       value: formatTopic(topic.topic),
//       count: 0,
//     }));

//     setAllTags(allPossibleTags);

//     const tagMap = new Map<string, number>();

//     allPossibleTags.forEach((tag) => {
//       tagMap.set(tag.value, 0);
//     });

//     mockData.posts.forEach((post) => {
//       tagMap.set(post.topic, (tagMap.get(post.topic) || 0) + 1);
//     });

//     mockData.responses.forEach((response) => {
//       tagMap.set(response.topic, tagMap.get(response.topic) || 0 + 1);
//     });

//     const tagsWithCounts = Array.from(tagMap.entries()).map(
//       ([value, count]) => ({ value, count })
//     );
//     setTags(tagsWithCounts);
//     setAllTags(tagsWithCounts);
//     setLoading((prev) => ({ ...prev, tags: false }));
//   }, []);

//   const handleTagPress = async (tag: { value: string }) => {
//     setSelectedTag(tag.value);
//     setLoading((prev) => ({ ...prev, content: true }));
//     setContentItems([]);

//     try {
//       const filteredPosts = mockData.posts.filter(
//         (post) => post.topic === tag.value
//       );
//       const filteredResponses = mockData.responses.filter(
//         (response) => response.topic === tag.value
//       );

//       const postPromises: Promise<ContentItem | null>[] = filteredPosts.map(
//         async (post) => {
//           try {
//             const postData = await getPostById(post.$id);
//             return {
//               id: post.$id,
//               content: postData.content,
//               type: "post" as const,
//             };
//           } catch (error) {
//             console.warn(`Failed to fetch post ${post.$id}:`, error);
//             return null;
//           }
//         }
//       );

//       const responsePromises: Promise<ContentItem | null>[] =
//         filteredResponses.map(async (response) => {
//           try {
//             const responseData = await getResponseById(response.$id);
//             return {
//               id: response.$id,
//               content: responseData.content,
//               type: "response" as const,
//             };
//           } catch (error) {
//             console.warn(`Failed to fetch response ${response.$id}:`, error);
//             return null;
//           }
//         });

//       const [postsContent, responsesContent] = await Promise.all([
//         Promise.all(postPromises),
//         Promise.all(responsePromises),
//       ]);

//       const combinedContent = [
//         ...postsContent.filter((item): item is ContentItem => item !== null),
//         ...responsesContent.filter(
//           (item): item is ContentItem => item !== null
//         ),
//       ];

//       setContentItems(combinedContent);
//     } catch (error) {
//       console.error("Error fetching content:", error);
//     } finally {
//       setLoading((prev) => ({ ...prev, content: false }));
//       bottomSheetRef.current?.expand();
//     }
//   };

//   return (
//     <GestureHandlerRootView className="flex-1">
//       <SafeAreaView className="flex-1">
//         {loading.tags ? (
//           <View className="flex-1 justify-center items-center">
//             <ActivityIndicator size="large" />
//           </View>
//         ) : (
//           <>
//             <View className="m-2 items-center justify-center">
//               <TagCloud
//                 minSize={12}
//                 maxSize={35}
//                 tags={allTags}
//                 disableRandomColor={false}
//                 onPress={handleTagPress}
//                 shuffle={false}
//               />
//               <Text className="mt-20 text-gray-500 text-sm">
//                 Tap any word from the cloud
//               </Text>
//             </View>

//             <BottomSheet
//               ref={bottomSheetRef}
//               index={-1}
//               snapPoints={["40%", "75%"]}
//               enablePanDownToClose={true}
//             >
//               <BottomSheetScrollView
//                 contentContainerStyle={styles.contentContainer}
//               >
//                 <Text className="text-lg font-bold mb-4">
//                   Overcoming Challenges
//                 </Text>

//                 {loading.content ? (
//                   <ActivityIndicator size="large" />
//                 ) : contentItems.length > 0 ? (
//                   contentItems.map((item) => (
//                     <View
//                       key={item.id}
//                       className="mb-4 p-3 bg-gray-100 rounded-lg"
//                     >
//                       <Text className="text-sm">{item.content}</Text>
//                     </View>
//                   ))
//                 ) : selectedTag ? (
//                   <Text className="text-gray-500">
//                     No shared experiences found for {selectedTag}
//                   </Text>
//                 ) : (
//                   <Text className="text-gray-500">
//                     Select a tag to view shared experiences
//                   </Text>
//                 )}
//               </BottomSheetScrollView>
//             </BottomSheet>
//           </>
//         )}
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default WordCloud;

// const styles = StyleSheet.create({
//   contentContainer: {
//     padding: 20,
//   },
// });





// import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
// import React, { useRef, useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TagCloud } from "react-tagcloud/rn";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import { 
//   getExperiencePostsByTopic,
//   getExperienceResponsesByTopic,
// } from "@/lib/appwrite/appwrite";
// import { formatTopic } from "@/utils/stringHelpers";
// import { topics } from "@/constants/constants"; // Import your predefined topics


// type TagItem = {
//   value: string;
//   count: number;
// };

// type ContentItem = {
//   id: string;
//   content: string;
// };

// const WordCloud = () => {
//   const bottomSheetRef = useRef<BottomSheet | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [contentItems, setContentItems] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState({
//     tags: false, // No loading needed for predefined tags
//     content: false,
//   });
//   const [tags, setTags] = useState<TagItem[]>([]);

//   useEffect(() => {
//     // Convert your string array to TagItem format
//     const formattedTags = topics.map(topic => ({
//       value: formatTopic(topic),
//       count: 1 // Equal weight for all tags
//     }));
//     setTags(formattedTags);
//   }, []);

//   const handleTagPress = async (tag: { value: string }) => {
//     setSelectedTag(tag.value);
//     setLoading(prev => ({ ...prev, content: true }));
//     setContentItems([]);

//     try {
//       // Fetch both posts and responses for the selected topic
//       const [posts, responses] = await Promise.all([
//         getExperiencePostsByTopic(tag.value),
//         getExperienceResponsesByTopic(tag.value)
//       ]);

//       // Combine and format the content
//       const combinedContent = [
//         ...posts.map(post => ({
//           id: post.$id,
//           content: post.content
//         })),
//         ...responses.map(response => ({
//           id: response.$id,
//           content: response.content
//         }))
//       ];

//       setContentItems(combinedContent);
//     } catch (error) {
//       console.error("Error fetching experiences:", error);
//     } finally {
//       setLoading(prev => ({ ...prev, content: false }));
//       bottomSheetRef.current?.expand();
//     }
//   };

//   return (
//     <GestureHandlerRootView className="flex-1">
//       <SafeAreaView className="flex-1">
//         <>
//           <View className="m-2 items-center justify-center">
//             <TagCloud
//               minSize={12}
//               maxSize={35}
//               tags={tags}
//               disableRandomColor={false}
//               onPress={handleTagPress}
//               shuffle={false}
//             />
//             <Text className="mt-20 text-gray-500 text-sm">
//               Tap any word from the cloud
//             </Text>
//           </View>

//           <BottomSheet
//             ref={bottomSheetRef}
//             index={-1}
//             snapPoints={["40%", "75%"]}
//             enablePanDownToClose={true}
//           >
//             <BottomSheetScrollView
//               contentContainerStyle={styles.contentContainer}
//             >
//               <Text className="text-lg font-bold mb-4">
//                 {selectedTag ? `${formatTopic(selectedTag)} Experiences` : "Shared Experiences"}
//               </Text>

//               {loading.content ? (
//                 <ActivityIndicator size="large" />
//               ) : contentItems.length > 0 ? (
//                 contentItems.map((item) => (
//                   <View
//                     key={item.id}
//                     className="mb-4 p-3 bg-gray-100 rounded-lg"
//                   >
//                     <Text className="text-sm">{item.content}</Text>
//                   </View>
//                 ))
//               ) : selectedTag ? (
//                 <Text className="text-gray-500">
//                   No shared experiences found for {selectedTag}
//                 </Text>
//               ) : (
//                 <Text className="text-gray-500">
//                   Select a tag to view shared experiences
//                 </Text>
//               )}
//             </BottomSheetScrollView>
//           </BottomSheet>
//         </>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// export default WordCloud;

// const styles = StyleSheet.create({
//   contentContainer: {
//     padding: 20,
//   },
// });



// import { Text, View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
// import React, { useRef, useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TagCloud } from "react-tagcloud/rn";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import { 
//   getExperiencePostsByTopic,
//   getExperienceResponsesByTopic,
// } from "@/lib/appwrite/appwrite";
// import { formatTopic } from "@/utils/stringHelpers";
// import { topics } from "@/constants/constants";

// type TagItem = {
//   value: string;
//   count: number;
// };

// type ContentItem = {
//   id: string;
//   content: string;
// };

// const { width } = Dimensions.get('window');

// const WordCloud = () => {
//   const bottomSheetRef = useRef<BottomSheet | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [contentItems, setContentItems] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState({
//     tags: false,
//     content: false,
//     error: false,
//   });
//   const [tags, setTags] = useState<TagItem[]>([]);

//   useEffect(() => {
//     const formattedTags = topics.map(topic => ({
//       value: formatTopic(topic),
//       count: 1
//     }));
//     setTags(formattedTags);
//   }, []);

//   const handleTagPress = async (tag: { value: string }) => {
//     setSelectedTag(tag.value);
//     setLoading(prev => ({ ...prev, content: true, error: false }));
//     setContentItems([]);

//     try {
//       const [posts, responses] = await Promise.all([
//         getExperiencePostsByTopic(tag.value).catch(() => []),
//         getExperienceResponsesByTopic(tag.value).catch(() => [])
//       ]);

//       const combinedContent = [
//         ...posts.map(post => ({
//           id: post.$id,
//           content: post.content
//         })),
//         ...responses.map(response => ({
//           id: response.$id,
//           content: response.content
//         }))
//       ];

//       if (combinedContent.length === 0) {
//         setLoading(prev => ({ ...prev, error: true }));
//       }

//       setContentItems(combinedContent);
//     } catch (error) {
//       console.error("Error fetching experiences:", error);
//       setLoading(prev => ({ ...prev, error: true }));
//     } finally {
//       setLoading(prev => ({ ...prev, content: false }));
//       bottomSheetRef.current?.expand();
//     }
//   };

//   return (
//     <GestureHandlerRootView className="flex-1">
//       <SafeAreaView className="flex-1">
//         <View className="flex-1 justify-center items-center">
//           <View style={styles.cloudContainer}>
//             <TagCloud
//               minSize={16}
//               maxSize={36}
//               tags={tags}
//               disableRandomColor={false}
//               onPress={handleTagPress}
//               shuffle={false}
//               style={styles.tagCloud}
//             />
//             <Text className="mt-8 text-gray-500 text-sm">
//               Tap any word from the cloud
//             </Text>
//           </View>

//           <BottomSheet
//             ref={bottomSheetRef}
//             index={-1}
//             snapPoints={["40%", "75%"]}
//             enablePanDownToClose={true}
//           >
//             <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
//               <Text className="text-lg font-bold mb-4">
//                 {selectedTag ? `${formatTopic(selectedTag)} Experiences` : "Shared Experiences"}
//               </Text>

//               {loading.content ? (
//                 <ActivityIndicator size="large" />
//               ) : loading.error ? (
//                 <View className="items-center justify-center p-4">
//                   <Text className="text-gray-500 mb-2">
//                     No experiences found yet for {selectedTag}
//                   </Text>
//                   <Text className="text-gray-400 text-sm">
//                     Be the first to share your experience!
//                   </Text>
//                 </View>
//               ) : contentItems.length > 0 ? (
//                 contentItems.map((item) => (
//                   <View
//                     key={item.id}
//                     className="mb-4 p-4 bg-gray-100 rounded-lg"
//                   >
//                     <Text className="text-sm">{item.content}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text className="text-gray-500">
//                   Select a tag to view shared experiences
//                 </Text>
//               )}
//             </BottomSheetScrollView>
//           </BottomSheet>
//         </View>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   contentContainer: {
//     padding: 20,
//   },
//   cloudContainer: {
//     width: width * 0.9,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//   },
//   tagCloud: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
// });

// export default WordCloud;



// import { Text, View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
// import React, { useRef, useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { TagCloud } from "react-tagcloud/rn";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
// import { 
//   getExperiencePostsByTopic,
//   getExperienceResponsesByTopic,
// } from "@/lib/appwrite/appwrite";
// import { formatTopic } from "@/utils/stringHelpers";
// import { topics } from "@/constants/constants";

// type TagItem = {
//   value: string;
//   count: number;
// };

// type ContentItem = {
//   id: string;
//   content: string;
// };

// const { width } = Dimensions.get('window');

// const WordCloud = () => {
//   const bottomSheetRef = useRef<BottomSheet | null>(null);
//   const [selectedTag, setSelectedTag] = useState<string | null>(null);
//   const [contentItems, setContentItems] = useState<ContentItem[]>([]);
//   const [loading, setLoading] = useState({
//     tags: false,
//     content: false,
//     error: false,
//   });
//   const [tags, setTags] = useState<TagItem[]>([]);

//   useEffect(() => {
//     const formattedTags = topics.map(topic => ({
//       value: formatTopic(topic),
//       count: 1
//     }));
//     setTags(formattedTags);
//   }, []);

//   const handleTagPress = async (tag: { value: string }) => {
//     setSelectedTag(tag.value);
//     setLoading(prev => ({ ...prev, content: true, error: false }));
//     setContentItems([]);

//     try {
//       const [posts, responses] = await Promise.all([
//         getExperiencePostsByTopic(tag.value).catch(() => []),
//         getExperienceResponsesByTopic(tag.value).catch(() => [])
//       ]);

//       const combinedContent = [
//         ...posts.map(post => ({
//           id: post.$id,
//           content: post.content
//         })),
//         ...responses.map(response => ({
//           id: response.$id,
//           content: response.content
//         }))
//       ];

//       if (combinedContent.length === 0) {
//         setLoading(prev => ({ ...prev, error: true }));
//       }

//       setContentItems(combinedContent);
//     } catch (error) {
//       console.error("Error fetching experiences:", error);
//       setLoading(prev => ({ ...prev, error: true }));
//     } finally {
//       setLoading(prev => ({ ...prev, content: false }));
//       bottomSheetRef.current?.expand();
//     }
//   };

//   return (
//     <GestureHandlerRootView className="flex-1">
//       <SafeAreaView className="flex-1">
//         {/* Container updated to start from the top with a small top padding */}
//         <View style={styles.mainContainer}>
//           <View style={styles.cloudContainer}>
//             <TagCloud
//               minSize={16}
//               maxSize={36}
//               tags={tags}
//               disableRandomColor={false}
//               onPress={handleTagPress}
//               shuffle={false}
//               style={styles.tagCloud}
//             />
//             <Text style={styles.instructionText}>
//               Tap any word from the cloud
//             </Text>
//           </View>

//           <BottomSheet
//             ref={bottomSheetRef}
//             index={-1}
//             snapPoints={["40%", "75%"]}
//             enablePanDownToClose={true}
//           >
//             <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
//               <Text style={styles.bottomSheetTitle}>
//                 Shared Experiences:
//               </Text>

//               {loading.content ? (
//                 <ActivityIndicator size="large" />
//               ) : loading.error ? (
//                 <View style={styles.errorContainer}>
//                   <Text style={styles.errorText}>
//                     No experiences found yet for {selectedTag}
//                   </Text>
//                 </View>
//               ) : contentItems.length > 0 ? (
//                 contentItems.map((item) => (
//                   <View
//                     key={item.id}
//                     style={styles.contentItem}
//                   >
//                     <Text style={styles.contentText}>{item.content}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.emptyText}>
//                   Select a tag to view shared experiences
//                 </Text>
//               )}
//             </BottomSheetScrollView>
//           </BottomSheet>
//         </View>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     alignItems: "center",
//     paddingTop: 20, // Adjust this value as needed for top padding
//   },
//   cloudContainer: {
//     width: width * 0.9,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 20,
//   },
//   tagCloud: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },
//   instructionText: {
//     marginTop: 8,
//     color: "gray",
//     fontSize: 14,
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   bottomSheetTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   errorContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   errorText: {
//     color: "gray",
//     marginBottom: 8,
//   },
//   errorSubText: {
//     color: "gray",
//     fontSize: 12,
//   },
//   contentItem: {
//     marginBottom: 16,
//     padding: 16,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 8,
//   },
//   contentText: {
//     fontSize: 14,
//   },
//   emptyText: {
//     color: "gray",
//   },
// });

// export default WordCloud;


import React, { useRef, useState, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Dimensions, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TagCloud } from "react-tagcloud/rn";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { 
  getExperiencePostsByTopic,
  getExperienceResponsesByTopic,
} from "@/lib/appwrite/appwrite";
import { formatTopic } from "@/utils/stringHelpers";
import { topics } from "@/constants/constants";

type TagItem = {
  value: string;
  count: number;
};

type ContentItem = {
  id: string;
  content: string;
};

const { width } = Dimensions.get('window');

const WordCloud = () => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState({
    content: false,
    error: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [tags, setTags] = useState<TagItem[]>([]);

  useEffect(() => {
    const formattedTags = topics.map(topic => ({
      value: formatTopic(topic),
      count: 1
    }));
    setTags(formattedTags);
  }, []);

  // Function to fetch experiences for a given tag value.
  const fetchExperiences = async (tagValue: string) => {
    setLoading(prev => ({ ...prev, content: true, error: false }));
    setContentItems([]);
    try {
      const [posts, responses] = await Promise.all([
        getExperiencePostsByTopic(tagValue).catch(() => []),
        getExperienceResponsesByTopic(tagValue).catch(() => [])
      ]);

      const combinedContent = [
        ...posts.map(post => ({
          id: post.$id,
          content: post.content
        })),
        ...responses.map(response => ({
          id: response.$id,
          content: response.content
        }))
      ];

      if (combinedContent.length === 0) {
        setLoading(prev => ({ ...prev, error: true }));
      }

      setContentItems(combinedContent);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setLoading(prev => ({ ...prev, error: true }));
    } finally {
      setLoading(prev => ({ ...prev, content: false }));
      bottomSheetRef.current?.expand();
    }
  };

  // Called when a tag in the cloud is pressed.
  const handleTagPress = async (tag: { value: string }) => {
    setSelectedTag(tag.value);
    await fetchExperiences(tag.value);
  };

  // Called when the user pulls to refresh.
  const handleRefresh = async () => {
    if (!selectedTag) return;
    setRefreshing(true);
    try {
      await fetchExperiences(selectedTag);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <View style={styles.cloudContainer}>
            <TagCloud
              minSize={16}
              maxSize={36}
              tags={tags}
              disableRandomColor={false}
              onPress={handleTagPress}
              shuffle={false}
              style={styles.tagCloud}
            />
            <Text style={styles.instructionText}>
              Tap any word from the cloud
            </Text>
          </View>

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={["40%", "75%"]}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView 
              contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
            >
              <Text style={styles.bottomSheetTitle}>
                Shared Experiences:
              </Text>

              {loading.content ? (
                <ActivityIndicator size="large" />
              ) : loading.error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    No experiences found yet for {selectedTag}
                  </Text>
                </View>
              ) : contentItems.length > 0 ? (
                contentItems.map((item) => (
                  <View key={item.id} style={styles.contentItem}>
                    <Text style={styles.contentText}>{item.content}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  Select a tag to view shared experiences
                </Text>
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20, // Adjust this value as needed for top padding
  },
  cloudContainer: {
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  tagCloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  instructionText: {
    marginTop: 8,
    color: "gray",
    fontSize: 14,
  },
  contentContainer: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "gray",
    marginBottom: 8,
  },
  contentItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  contentText: {
    fontSize: 14,
  },
  emptyText: {
    color: "gray",
  },
});

export default WordCloud;
