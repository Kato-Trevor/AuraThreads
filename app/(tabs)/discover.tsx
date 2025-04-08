// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   GestureResponderEvent,
//   TextInput,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import SearchInput from "@/components/SearchInput";

// interface ContentItem {
//   id: string;
//   title: string;
//   description: string;
//   details?: string;
// }

// // Dummy data for each fundamental category

// const awarenessContent: ContentItem[] = [
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

// const connectionContent: ContentItem[] = [
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

// const insightContent: ContentItem[] = [
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

// const purposeContent: ContentItem[] = [
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

// const Discover: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   // Filter function: returns only the items that match the search query.
//   const filterContent = (data: ContentItem[]): ContentItem[] => {
//     if (!searchQuery.trim()) return data;
//     const query = searchQuery.toLowerCase();
//     return data.filter(
//       item =>
//         item.title.toLowerCase().includes(query) ||
//         item.description.toLowerCase().includes(query) ||
//         (item.details && item.details.toLowerCase().includes(query))
//     );
//   };

//   // Helper function to render a section with cards.
//   const renderSection = (sectionTitle: string, data: ContentItem[]) => {
//     const filteredData = filterContent(data);
//     if (filteredData.length === 0) return null;
//     return (
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>{sectionTitle}</Text>
//         {filteredData.map((item: ContentItem) => (
//           <TouchableOpacity
//             key={item.id}
//             style={styles.card}
//             onPress={(event: GestureResponderEvent) => {
//               // Example: Log or navigate to a detailed view for this content item
//               console.log(`Selected: ${item.title}`);
//             }}
//           >
//             <Text style={styles.cardTitle}>{item.title}</Text>
//             <Text style={styles.cardDescription}>{item.description}</Text>
//             {item.details && <Text style={styles.cardDetails}>{item.details}</Text>}
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Discover Mental Well-Being</Text>
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search..."
//           value={searchQuery}
//           onChangeText={text => setSearchQuery(text)}
//         />
//       </View>
//       {renderSection('Awareness', awarenessContent)}
//       {renderSection('Connection', connectionContent)}
//       {renderSection('Insight', insightContent)}
//       {renderSection('Purpose', purposeContent)}
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
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
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

// export default Discover;
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInput from "@/components/SearchInput";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const RECENT_SEARCHES_KEY = "aura_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const SearchScreen = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState([
    "Self-Care Routines",
    "Sleep Improvement",
    "ImposterSyndrome",
    "Procrastination",
    "Burnout",
    "Homesickness",
  ]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const storedSearches = await SecureStore.getItemAsync(
        RECENT_SEARCHES_KEY
      );
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await SecureStore.setItemAsync(
        RECENT_SEARCHES_KEY,
        JSON.stringify(searches)
      );
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const addToRecentSearches = async (query: string) => {
    if (!query.trim()) return;

    const updatedSearches = [query];
    recentSearches.forEach((search) => {
      if (
        search.toLowerCase() !== query.toLowerCase() &&
        updatedSearches.length < MAX_RECENT_SEARCHES
      ) {
        updatedSearches.push(search);
      }
    });

    setRecentSearches(updatedSearches);
    await saveRecentSearches(updatedSearches);
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await saveRecentSearches([]);
  };

  const handleTopicSelect = (topic: string) => {
    addToRecentSearches(topic);
    router.push(`/search-post/${topic}` as any);
  };

  const handleSearch = (query: string) => {
    addToRecentSearches(query);
    router.push(`/search-post/${query}` as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: 0 }}>
      {/* Header */}
      <View className="px-5 pt-1 pb-2">
        <Text className="text-2xl font-bold text-gray-800">Discover</Text>
      </View>

      {/* Search Input */}
      <View className="px-5">
        <SearchInput
          placeholderText="Search mental health resources..."
          onSearch={handleSearch}
        />
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold text-gray-800">
                Recent Searches
              </Text>
              <TouchableOpacity onPress={clearRecentSearches}>
                <Text className="text-pink-500 font-medium">Clear all</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-1">
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center py-2.5 border-b border-gray-100"
                  onPress={() => handleTopicSelect(item)}
                >
                  <Feather name="clock" size={16} color="#666" />
                  <Text className="ml-3 text-gray-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trending Topics Section */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-800">
              Trending Mental Health Topics
            </Text>
            <TouchableOpacity>
              <Text className="text-pink-500 font-medium">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap mt-1">
            {trendingTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                className="bg-pink-100 px-4 py-2 rounded-full mr-2 mb-2"
                onPress={() => handleTopicSelect(topic)}
              >
                <Text className="text-pink-500 font-medium">{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
