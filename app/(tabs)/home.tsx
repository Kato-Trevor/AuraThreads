// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// const Home = () => {
//   // Dummy dynamic data – in a real app these would be fetched from an API or local store.
//   const dailyAffirmation = "Every day is a new chance to grow.";
//   const dailyChallenge = "Take a 10-minute walk.";
//   const weeklyChallenge = "Try a new healthy recipe.";
//   const monthlyChallenge = "Set one long-term personal goal.";

//   return (
//     <ScrollView className="flex-1 bg-white px-4 pt-6">
//       {/* Dynamic Daily Affirmation */}
//       <View className="bg-[#F5F5F5] p-4 rounded-2xl shadow-sm mb-6">
//         <Text className="text-base text-[#333333] italic">
//           “{dailyAffirmation}”
//         </Text>
//       </View>

//       {/* Journal Access with Write Icon */}
//       <View className="flex-row justify-end mb-6">
//         <TouchableOpacity className="bg-[#333333] p-3 rounded-full">
//           <Ionicons name="create" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>

//       {/* Goal Tracking */}
//       <View className="mb-6">
//         <Text className="text-lg font-bold mb-2 text-[#333333]">Your Goals</Text>
//         <View className="bg-[#F5F5F5] p-4 rounded-xl">
//           {/* Replace these with dynamic goal data */}
//           <Text className="text-sm text-[#333333] mb-1">
//             Daily Goal: Drink 8 glasses of water
//           </Text>
//           <Text className="text-sm text-[#333333] mb-1">
//             Weekly Goal: Exercise 4 times
//           </Text>
//           <Text className="text-sm text-[#333333]">
//             Monthly Goal: Read 2 books
//           </Text>
//         </View>
//       </View>

//       {/* Challenges Section */}
//       <View className="mb-10">
//         <Text className="text-lg font-bold mb-2 text-[#333333]">Challenges</Text>

//         {/* Daily Challenge */}
//         <View className="bg-[#F5F5F5] p-4 rounded-xl border border-[#D1D1D1] mb-4">
//           <Text className="text-sm text-[#333333] font-semibold mb-1">
//             Daily Challenge
//           </Text>
//           <Text className="text-sm text-[#333333] mb-2">
//             {dailyChallenge}
//           </Text>
//           <TouchableOpacity className="mt-1 bg-[#333333] rounded-md py-1 px-3 self-start">
//             <Text className="text-white text-sm">Join</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Weekly Challenge */}
//         <View className="bg-[#F5F5F5] p-4 rounded-xl border border-[#D1D1D1] mb-4">
//           <Text className="text-sm text-[#333333] font-semibold mb-1">
//             Weekly Challenge
//           </Text>
//           <Text className="text-sm text-[#333333] mb-2">
//             {weeklyChallenge}
//           </Text>
//           <TouchableOpacity className="mt-1 bg-[#333333] rounded-md py-1 px-3 self-start">
//             <Text className="text-white text-sm">Join</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Monthly Challenge */}
//         <View className="bg-[#F5F5F5] p-4 rounded-xl border border-[#D1D1D1]">
//           <Text className="text-sm text-[#333333] font-semibold mb-1">
//             Monthly Challenge
//           </Text>
//           <Text className="text-sm text-[#333333] mb-2">
//             {monthlyChallenge}
//           </Text>
//           <TouchableOpacity className="mt-1 bg-[#333333] rounded-md py-1 px-3 self-start">
//             <Text className="text-white text-sm">Join</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default Home;


// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // For debouncing, install lodash.debounce with `npm install lodash.debounce`
// import debounce from 'lodash.debounce';

// const Home = () => {
//   const [entry, setEntry] = useState('');
//   const [isEditing, setIsEditing] = useState(false);

//   // Load the draft entry when the component mounts
//   useEffect(() => {
//     const loadDraft = async () => {
//       try {
//         const storedDraft = await AsyncStorage.getItem('journalDraft');
//         if (storedDraft !== null) {
//           setEntry(storedDraft);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal draft:', error);
//       }
//     };
//     loadDraft();
//   }, []);

//   // Debounced function to auto-save the journal entry
//   const saveDraft = useCallback(
//     debounce(async (text: string) => {
//       try {
//         await AsyncStorage.setItem('journalDraft', text);
//         // Optionally, you could trigger a backend update here as well.
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   // When text changes, update the state and trigger auto-save
//   const handleChangeText = (text: string) => {
//     setEntry(text);
//     saveDraft(text);
//   };

//   // When the screen is tapped and not in editing mode, switch to editing mode
//   const activateEditing = () => {
//     setIsEditing(true);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={() => { 
//         if (!isEditing) { 
//           activateEditing(); 
//         } else { 
//           // Dismiss keyboard if already editing
//           Keyboard.dismiss(); 
//           setIsEditing(false);
//         }
//       }}>
//       <View style={styles.container}>
//         {isEditing ? (
//           <TextInput
//             style={styles.textInput}
//             multiline
//             autoFocus
//             value={entry}
//             onChangeText={handleChangeText}
//             placeholder="Write your thoughts..."
//             placeholderTextColor="#aaa"
//             textAlignVertical="top"
//           />
//         ) : (
//           <Text style={styles.text} onPress={activateEditing}>
//             {entry.length > 0 ? entry : 'Tap anywhere to start writing...'}
//           </Text>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff'
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
// });


// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';

// const Home = () => {
//   const [entry, setEntry] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Get current date and time
//   const now = new Date();
//   const currentDate = now.toLocaleDateString(undefined, {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
//   const currentTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

//   // Load draft when the screen mounts
//   useEffect(() => {
//     const loadDraft = async () => {
//       try {
//         const storedDraft = await AsyncStorage.getItem('journalDraft');
//         if (storedDraft !== null) {
//           setEntry(storedDraft);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal draft:', error);
//       }
//     };
//     loadDraft();
//   }, []);

//   // Debounced auto-save
//   const saveDraft = useCallback(
//     debounce(async (text: string) => {
//       try {
//         await AsyncStorage.setItem('journalDraft', text);
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   const handleChangeText = (text: string) => {
//     setEntry(text);
//     saveDraft(text);
//   };

//   // Function to update pagination based on scroll event details
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const visibleHeight = event.nativeEvent.layoutMeasurement.height;
//     const totalHeight = event.nativeEvent.contentSize.height;
//     const page = Math.floor(offsetY / visibleHeight) + 1;
//     const pages = Math.ceil(totalHeight / visibleHeight);
//     setCurrentPage(page);
//     setTotalPages(pages);
//   };

//   // Toggle editing mode
//   const toggleEditing = () => {
//     // If we're already editing, dismiss the keyboard and exit edit mode
//     if (isEditing) {
//       Keyboard.dismiss();
//       setIsEditing(false);
//     } else {
//       setIsEditing(true);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Top-right: Date and Time */}
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{currentDate}</Text>
//           <Text style={styles.timestampText}>{currentTime}</Text>
//         </View>

//         {/* Main content area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             // Editable mode: using TextInput with onScroll event
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus
//               value={entry}
//               onChangeText={handleChangeText}
//               onScroll={handleScroll}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#aaa"
//               textAlignVertical="top"
//               // Ensure scrolling is enabled inside the TextInput
//               scrollEnabled={true}
//             />
//           ) : (
//             // Read-only mode: wrap the text in a ScrollView to capture scrolling
//             <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
//               <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                 {entry.length > 0 ? entry : 'Tap anywhere to start writing...'}
//               </Text>
//             </ScrollView>
//           )}
//         </View>

//         {/* Bottom-right: Page count indicator */}
//         <View style={styles.pageCountContainer}>
//           <Text style={styles.pageCountText}>
//             Page {currentPage} of {totalPages}
//           </Text>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 40,
//   },
//   dateContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timestampText: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     marginTop: 40, // leave space for the date area
//     marginBottom: 40, // leave space for the page count indicator
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
//   pageCountContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });





// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   TouchableOpacity,
//   Keyboard,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const Home = () => {
//   const [entry, setEntry] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   // Get current date and time
//   const now = new Date();
//   const currentDate = now.toLocaleDateString(undefined, {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
//   const currentTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

//   // Load draft when the screen mounts
//   useEffect(() => {
//     const loadDraft = async () => {
//       try {
//         const storedDraft = await AsyncStorage.getItem('journalDraft');
//         if (storedDraft !== null) {
//           setEntry(storedDraft);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal draft:', error);
//       }
//     };
//     loadDraft();
//   }, []);

//   // Debounced auto-save
//   const saveDraft = useCallback(
//     debounce(async (text: string) => {
//       try {
//         await AsyncStorage.setItem('journalDraft', text);
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   const handleChangeText = (text: string) => {
//     setEntry(text);
//     saveDraft(text);
//   };

//   // Function to update pagination based on scroll event details
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const visibleHeight = event.nativeEvent.layoutMeasurement.height;
//     const totalHeight = event.nativeEvent.contentSize.height;
//     const page = Math.floor(offsetY / visibleHeight) + 1;
//     const pages = Math.ceil(totalHeight / visibleHeight);
//     setCurrentPage(page);
//     setTotalPages(pages);
//   };

//   // Toggle editing mode for the entire screen (touch anywhere to toggle)
//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   // Toggle editing mode manually via the icon button
//   const toggleEditingManually = () => {
//     // Prevent propagation if tapping on the icon
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Top-left: Manual toggle icon */}
//         <TouchableOpacity style={styles.iconButton} onPress={toggleEditingManually}>
//           {isEditing ? (
//             // In editing mode, show "book" icon to switch to reading mode
//             <Icon name="book-open-page-variant" size={28} color="#555" />
//           ) : (
//             // In reading mode, show "pencil" icon to switch to writing mode
//             <Icon name="pencil" size={28} color="#555" />
//           )}
//         </TouchableOpacity>

//         {/* Top-right: Date and Time */}
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{currentDate}</Text>
//           <Text style={styles.timestampText}>{currentTime}</Text>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus
//               value={entry}
//               onChangeText={handleChangeText}
//               onScroll={handleScroll}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#aaa"
//               textAlignVertical="top"
//               scrollEnabled={true}
//             />
//           ) : (
//             <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
//               <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                 {entry.length > 0 ? entry : 'Tap anywhere to start writing...'}
//               </Text>
//             </ScrollView>
//           )}
//         </View>

//         {/* Bottom-right: Page Count Indicator */}
//         <View style={styles.pageCountContainer}>
//           <Text style={styles.pageCountText}>
//             Page {currentPage} of {totalPages}
//           </Text>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 40,
//   },
//   iconButton: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     zIndex: 10,
//     padding: 5,
//   },
//   dateContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timestampText: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     marginTop: 40, // leave space for the date area
//     marginBottom: 40, // leave space for the page count
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
//   pageCountContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });






// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   TouchableOpacity,
//   Keyboard,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const { width: windowWidth } = Dimensions.get('window');
// const containerPadding = 20;
// const MAX_PAGES = 10; // Predefined total number of pages (hidden from user)

// const paginateText = (text: string, maxChars: number = 800): string[] => {
//   if (!text || text.trim() === '') return Array(MAX_PAGES).fill('');
//   const pages: string[] = Array(MAX_PAGES).fill('');
//   let currentPage = 0;
//   let currentPageLength = 0;
  
//   const words = text.split(' ');
  
//   for (const word of words) {
//     if (currentPageLength + word.length > maxChars && currentPage < MAX_PAGES - 1) {
//       currentPage++;
//       currentPageLength = 0;
//     }
    
//     if (currentPage < MAX_PAGES) {
//       pages[currentPage] = pages[currentPage] + (pages[currentPage] ? ' ' : '') + word;
//       currentPageLength += word.length + 1; // +1 for space
//     }
//   }
  
//   return pages;
// };

// const Home = () => {
//   const [entry, setEntry] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pages, setPages] = useState<string[]>(Array(MAX_PAGES).fill(''));
//   const scrollViewRef = useRef<ScrollView>(null);

//   const now = new Date();
//   const currentDate = now.toLocaleDateString(undefined, {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
//   const currentTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

//   useEffect(() => {
//     const loadDraft = async () => {
//       try {
//         const storedDraft = await AsyncStorage.getItem('journalDraft');
//         if (storedDraft !== null) {
//           setEntry(storedDraft);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal draft:', error);
//       }
//     };
//     loadDraft();
//   }, []);

//   useEffect(() => {
//     const newPages = paginateText(entry);
//     setPages(newPages);
//     setCurrentPage(1);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({ x: 0, animated: false });
//     }
//   }, [entry]);

//   const saveDraft = useCallback(
//     debounce(async (text: string) => {
//       try {
//         await AsyncStorage.setItem('journalDraft', text);
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   const handleChangeText = (text: string) => {
//     setEntry(text);
//     saveDraft(text);
//   };

//   const handleHorizontalScroll = (event: any) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     const page = Math.floor(offsetX / (windowWidth - containerPadding * 2)) + 1;
//     setCurrentPage(Math.min(page, MAX_PAGES));
//   };

//   const toggleEditing = () => {
//     if (isEditing) Keyboard.dismiss();
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) Keyboard.dismiss();
//   };

//   const scrollToPrevPage = () => {
//     if (currentPage > 1) {
//       const newPage = currentPage - 1;
//       scrollViewRef.current?.scrollTo({
//         x: (newPage - 1) * (windowWidth - containerPadding * 2),
//         animated: true,
//       });
//       setCurrentPage(newPage);
//     }
//   };

//   const scrollToNextPage = () => {
//     if (currentPage < MAX_PAGES) {
//       const newPage = currentPage + 1;
//       scrollViewRef.current?.scrollTo({
//         x: (newPage - 1) * (windowWidth - containerPadding * 2),
//         animated: true,
//       });
//       setCurrentPage(newPage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topBar}>
//         <View style={styles.topLeftContainer}>
//           <TouchableOpacity style={styles.iconButton} onPress={toggleEditingManually}>
//             {isEditing ? (
//               <Icon name="book" size={28} color="#555" />
//             ) : (
//               <Icon name="edit" size={28} color="#555" />
//             )}
//           </TouchableOpacity>
//           {!isEditing && (
//             <View style={styles.arrowsContainer}>
//               <TouchableOpacity style={styles.arrowButton} onPress={scrollToPrevPage}>
//                 <Icon name="chevron-left" size={28} color="#555" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.arrowButton} onPress={scrollToNextPage}>
//                 <Icon name="chevron-right" size={28} color="#555" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{currentDate}</Text>
//           <Text style={styles.timestampText}>{currentTime}</Text>
//         </View>
//       </View>

//       <View style={styles.content}>
//         {isEditing ? (
//           <TouchableWithoutFeedback onPress={toggleEditing}>
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus
//               value={entry}
//               onChangeText={handleChangeText}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#aaa"
//               textAlignVertical="top"
//             />
//           </TouchableWithoutFeedback>
//         ) : (
//           <ScrollView
//             ref={scrollViewRef}
//             horizontal
//             pagingEnabled
//             onMomentumScrollEnd={handleHorizontalScroll}
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ width: (windowWidth - containerPadding * 2) * MAX_PAGES }}
//           >
//             {pages.map((pageText, index) => (
//               <View style={styles.pageContainer} key={index}>
//                 <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                   {pageText || (index === 0 ? 'Tap anywhere to start writing...' : '')}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>
//         )}
//       </View>

//       {!isEditing && (
//         <View style={styles.pageCountContainer}>
//           <Text style={styles.pageCountText}>
//             Page {Math.min(currentPage, pages.filter(p => p.trim() !== '').length || 1)}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: containerPadding,
//     paddingTop: 40,
//   },
//   topBar: {
//     position: 'absolute',
//     top: 20,
//     left: containerPadding,
//     right: containerPadding,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     zIndex: 10,
//   },
//   topLeftContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     padding: 5,
//   },
//   arrowsContainer: {
//     flexDirection: 'row',
//     marginLeft: 10,
//   },
//   arrowButton: {
//     padding: 5,
//     marginLeft: 5,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timestampText: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     marginTop: 60,
//     marginBottom: 40,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   pageContainer: {
//     width: windowWidth - containerPadding * 2,
//     paddingRight: 10,
//   },
//   pageCountContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });

// export default Home;



// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   TouchableOpacity,
//   Keyboard,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// const Home = () => {
//   const [entries, setEntries] = useState<{[key: number]: string}>({1: ''});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);

//   // Get current date and time
//   const now = new Date();
//   const currentDate = now.toLocaleDateString(undefined, {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
//   const currentTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

//   // Load drafts when the screen mounts
//   useEffect(() => {
//     const loadDrafts = async () => {
//       try {
//         const storedDrafts = await AsyncStorage.getItem('journalDrafts');
//         if (storedDrafts !== null) {
//           const parsedDrafts = JSON.parse(storedDrafts);
//           setEntries(parsedDrafts.entries);
//           setCurrentPage(parsedDrafts.currentPage || 1);
//           setTotalPages(parsedDrafts.totalPages || 1);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal drafts:', error);
//       }
//     };
//     loadDrafts();
//   }, []);

//   // Debounced auto-save
//   const saveDrafts = useCallback(
//     debounce(async (entries: {[key: number]: string}, currentPage: number, totalPages: number) => {
//       try {
//         await AsyncStorage.setItem('journalDrafts', JSON.stringify({
//           entries,
//           currentPage,
//           totalPages
//         }));
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   const handleChangeText = (text: string) => {
//     const updatedEntries = {...entries, [currentPage]: text};
//     setEntries(updatedEntries);
    
//     // Update total pages if we're at the end and adding content
//     let newTotalPages = totalPages;
//     if (currentPage === totalPages && text.length > 0 && totalPages < MAX_PAGES) {
//       newTotalPages = Math.min(totalPages + 1, MAX_PAGES);
//       setTotalPages(newTotalPages);
//     }
    
//     saveDrafts(updatedEntries, currentPage, newTotalPages);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1);
//     } else if (totalPages < MAX_PAGES) {
//       // Create a new page if we haven't reached max
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: ''});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   // Function to update pagination based on scroll event details
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const visibleHeight = event.nativeEvent.layoutMeasurement.height;
//     const totalHeight = event.nativeEvent.contentSize.height;
//     const pages = Math.ceil(totalHeight / visibleHeight);
//     setTotalPages(Math.max(pages, 1));
//   };

//   // Toggle editing mode for the entire screen (touch anywhere to toggle)
//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   // Toggle editing mode manually via the icon button
//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Top-left: Navigation and edit controls */}
//         <View style={styles.navContainer}>
//           <TouchableOpacity 
//             style={styles.navButton} 
//             onPress={goToPreviousPage}
//             disabled={currentPage === 1}
//           >
//             <Icon 
//               name="chevron-left" 
//               size={28} 
//               color={currentPage === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.editButton} 
//             onPress={toggleEditingManually}
//           >
//             {isEditing ? (
//               <Icon name="book-open-page-variant" size={28} color="#555" />
//             ) : (
//               <Icon name="pencil" size={28} color="#555" />
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.navButton} 
//             onPress={goToNextPage}
//             disabled={currentPage === totalPages && totalPages >= MAX_PAGES}
//           >
//             <Icon 
//               name="chevron-right" 
//               size={28} 
//               color={currentPage === totalPages && totalPages >= MAX_PAGES ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Top-right: Date and Time */}
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{currentDate}</Text>
//           <Text style={styles.timestampText}>{currentTime}</Text>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus
//               value={entries[currentPage] || ''}
//               onChangeText={handleChangeText}
//               onScroll={handleScroll}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#aaa"
//               textAlignVertical="top"
//               scrollEnabled={true}
//             />
//           ) : (
//             <ScrollView 
//               ref={scrollViewRef}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}
//             >
//               <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                 {entries[currentPage]?.length > 0 
//                   ? entries[currentPage] 
//                   : 'Tap anywhere to start writing...'}
//               </Text>
//             </ScrollView>
//           )}
//         </View>

//         {/* Bottom-right: Page Count Indicator */}
//         <View style={styles.pageCountContainer}>
//           <Text style={styles.pageCountText}>
//             Page {currentPage} of {totalPages}
//           </Text>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 40,
//   },
//   navContainer: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   navButton: {
//     padding: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginHorizontal: 10,
//   },
//   dateContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timestampText: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     marginTop: 40,
//     marginBottom: 40,
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
//   pageCountContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });





// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   TouchableOpacity,
//   Keyboard,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// const Home = () => {
//   const [entries, setEntries] = useState<{[key: number]: string}>({1: ''});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);

//   // Get current date and time
//   const now = new Date();
//   const currentDate = now.toLocaleDateString(undefined, {
//     weekday: 'short',
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
//   const currentTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

//   // Load drafts when the screen mounts
//   useEffect(() => {
//     const loadDrafts = async () => {
//       try {
//         const storedDrafts = await AsyncStorage.getItem('journalDrafts');
//         if (storedDrafts !== null) {
//           const parsedDrafts = JSON.parse(storedDrafts);
//           setEntries(parsedDrafts.entries || {1: ''});
//           setCurrentPage(parsedDrafts.currentPage || 1);
//           setTotalPages(parsedDrafts.totalPages || 1);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal drafts:', error);
//       }
//     };
//     loadDrafts();
//   }, []);

//   // Debounced auto-save
//   const saveDrafts = useCallback(
//     debounce(async (entries: {[key: number]: string}, currentPage: number, totalPages: number) => {
//       try {
//         await AsyncStorage.setItem('journalDrafts', JSON.stringify({
//           entries,
//           currentPage,
//           totalPages
//         }));
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   const handleChangeText = (text: string) => {
//     const updatedEntries = {...entries, [currentPage]: text};
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1);
//     } else if (totalPages < MAX_PAGES) {
//       // Only create new page when right arrow is clicked (button is enabled only when current page has content)
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: ''});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   // Function to update pagination based on scroll event details
//   const handleScroll = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const visibleHeight = event.nativeEvent.layoutMeasurement.height;
//     const totalHeight = event.nativeEvent.contentSize.height;
//     const pages = Math.ceil(totalHeight / visibleHeight);
//     setTotalPages(Math.max(pages, 1));
//   };

//   // Toggle editing mode for the entire screen (touch anywhere to toggle)
//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   // Toggle editing mode manually via the icon button
//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   // Check if current page has content
//   const currentPageHasContent = entries[currentPage]?.trim().length > 0;

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Top-left: Navigation and edit controls */}
//         <View style={styles.navContainer}>
//           <TouchableOpacity 
//             style={styles.navButton} 
//             onPress={goToPreviousPage}
//             disabled={currentPage === 1}
//           >
//             <Icon 
//               name="chevron-left" 
//               size={28} 
//               color={currentPage === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.editButton} 
//             onPress={toggleEditingManually}
//           >
//             {isEditing ? (
//               <Icon name="book-open-page-variant" size={28} color="#555" />
//             ) : (
//               <Icon name="pencil" size={28} color="#555" />
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.navButton} 
//             onPress={goToNextPage}
//             disabled={
//               // Disable if:
//               // 1. At last page AND current page is empty, OR
//               // 2. Reached max pages
//               (currentPage === totalPages && !currentPageHasContent) || 
//               currentPage === MAX_PAGES
//             }
//           >
//             <Icon 
//               name="chevron-right" 
//               size={28} 
//               color={
//                 (currentPage === totalPages && !currentPageHasContent) || 
//                 currentPage === MAX_PAGES ? '#ccc' : '#555'
//               } 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Top-right: Date and Time */}
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{currentDate}</Text>
//           <Text style={styles.timestampText}>{currentTime}</Text>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus
//               value={entries[currentPage] || ''}
//               onChangeText={handleChangeText}
//               onScroll={handleScroll}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#aaa"
//               textAlignVertical="top"
//               scrollEnabled={true}
//             />
//           ) : (
//             <ScrollView 
//               ref={scrollViewRef}
//               onScroll={handleScroll}
//               scrollEventThrottle={16}
//             >
//               <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                 {entries[currentPage]?.length > 0 
//                   ? entries[currentPage] 
//                   : 'Tap anywhere to start writing...'}
//               </Text>
//             </ScrollView>
//           )}
//         </View>

//         {/* Bottom-right: Page Count Indicator */}
//         <View style={styles.pageCountContainer}>
//           <Text style={styles.pageCountText}>
//             Page {currentPage} of {totalPages}
//           </Text>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 40,
//   },
//   navContainer: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   navButton: {
//     padding: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginHorizontal: 10,
//   },
//   dateContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timestampText: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     marginTop: 40,
//     marginBottom: 40,
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
//   pageCountContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });




// This still works

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   TouchableOpacity,
//   Keyboard,
//   ScrollView,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// interface PageData {
//   content: string;
//   createdAt?: string;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<{[key: number]: PageData}>({1: { content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);

//   // Format date and time
//   const formatTimestamp = (date: Date) => {
//     return {
//       date: date.toLocaleDateString(undefined, {
//         weekday: 'short',
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       }),
//       time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
//     };
//   };

//   // Load drafts when the screen mounts
//   useEffect(() => {
//     const loadDrafts = async () => {
//       try {
//         const storedDrafts = await AsyncStorage.getItem('journalDrafts');
//         if (storedDrafts !== null) {
//           const parsedDrafts = JSON.parse(storedDrafts);
//           // Ensure all entries have content property
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             acc[key] = {
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt
//             };
//             return acc;
//           }, {} as {[key: number]: PageData});
//           setEntries(sanitizedEntries || {1: { content: '' }});
//           setCurrentPage(parsedDrafts.currentPage || 1);
//           setTotalPages(parsedDrafts.totalPages || 1);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal drafts:', error);
//       }
//     };
//     loadDrafts();
//   }, []);

//   // Debounced auto-save
//   const saveDrafts = useCallback(
//     debounce(async (entries: {[key: number]: PageData}, currentPage: number, totalPages: number) => {
//       try {
//         await AsyncStorage.setItem('journalDrafts', JSON.stringify({
//           entries,
//           currentPage,
//           totalPages
//         }));
//       } catch (error) {
//         console.error('Auto-save failed:', error);
//       }
//     }, 1000),
//     []
//   );

//   const handleChangeText = (text: string) => {
//     const now = new Date();
//     const updatedEntries = {...entries};
    
//     // Initialize page data if it doesn't exist
//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { content: '' };
//     }
    
//     // If this is the first content being added to the page, set the timestamp
//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         content: text,
//         createdAt: now.toISOString()
//       };
//     } else {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
//         content: text
//       };
//     }
    
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     const currentContent = entries[currentPage]?.content || '';
//     if (currentPage < totalPages) {
//       goToPage(currentPage + 1);
//     } else if (totalPages < MAX_PAGES && currentContent.trim().length > 0) {
//       // Only create new page when right arrow is clicked and current page has content
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   // Safely check if current page has content
//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   // Get timestamp for current page with fallback
//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   // Toggle editing mode for the entire screen (touch anywhere to toggle)
//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   // Toggle editing mode manually via the icon button
//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Top-left: Navigation and edit controls */}
//         <View style={styles.navContainer}>
//           <TouchableOpacity 
//             style={styles.navButton} 
//             onPress={goToPreviousPage}
//             disabled={currentPage === 1}
//           >
//             <Icon 
//               name="chevron-left" 
//               size={28} 
//               color={currentPage === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.editButton} 
//             onPress={toggleEditingManually}
//           >
//             {isEditing ? (
//               <Icon name="book-open-page-variant" size={28} color="#555" />
//             ) : (
//               <Icon name="pencil" size={28} color="#555" />
//             )}
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.navButton} 
//             onPress={goToNextPage}
//             disabled={
//               (currentPage === totalPages && !currentPageHasContent) || 
//               currentPage === MAX_PAGES
//             }
//           >
//             <Icon 
//               name="chevron-right" 
//               size={28} 
//               color={
//                 (currentPage === totalPages && !currentPageHasContent) || 
//                 currentPage === MAX_PAGES ? '#ccc' : '#555'
//               } 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Top-right: Date and Time */}
//         <View style={styles.dateContainer}>
//           <Text style={styles.dateText}>{date}</Text>
//           <Text style={styles.timestampText}>{time}</Text>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus
//               value={entries[currentPage]?.content || ''}
//               onChangeText={handleChangeText}
//               placeholder="Write your thoughts..."
//               placeholderTextColor="#aaa"
//               textAlignVertical="top"
//               scrollEnabled={true}
//             />
//           ) : (
//             <ScrollView 
//               ref={scrollViewRef}
//               scrollEventThrottle={16}
//             >
//               <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                 {entries[currentPage]?.content?.length > 0 
//                   ? entries[currentPage].content 
//                   : 'Tap anywhere to start writing...'}
//               </Text>
//             </ScrollView>
//           )}
//         </View>

//         {/* Bottom-right: Page Count Indicator */}
//         <View style={styles.pageCountContainer}>
//           <Text style={styles.pageCountText}>
//             Page {currentPage} of {totalPages}
//           </Text>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 40,
//   },
//   navContainer: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   navButton: {
//     padding: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginHorizontal: 10,
//   },
//   dateContainer: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     alignItems: 'flex-end',
//   },
//   dateText: {
//     fontSize: 14,
//     color: '#999',
//   },
//   timestampText: {
//     fontSize: 12,
//     color: '#aaa',
//     marginTop: 2,
//   },
//   content: {
//     flex: 1,
//     marginTop: 40,
//     marginBottom: 40,
//   },
//   text: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//   },
//   textInput: {
//     fontSize: 18,
//     color: '#000',
//     lineHeight: 28,
//     flex: 1,
//   },
//   pageCountContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });

// export default Home;




import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MAX_PAGES = 10;

interface PageData {
  content: string;
  createdAt?: string;
}

const Home = () => {
  const [entries, setEntries] = useState<Record<number, PageData>>({1: { content: '' }});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Format date and time
  const formatTimestamp = (date: Date) => {
    return {
      date: date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Load drafts when the screen mounts
  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const storedDrafts = await AsyncStorage.getItem('journalDrafts');
        if (storedDrafts !== null) {
          const parsedDrafts = JSON.parse(storedDrafts);
          // Convert string keys to numbers and ensure proper structure
          const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
            const pageNumber = parseInt(key, 10);
            acc[pageNumber] = {
              content: (value as PageData).content || '',
              createdAt: (value as PageData).createdAt
            };
            return acc;
          }, {} as Record<number, PageData>);
          
          setEntries(sanitizedEntries || {1: { content: '' }});
          setCurrentPage(parsedDrafts.currentPage || 1);
          setTotalPages(parsedDrafts.totalPages || 1);
        }
      } catch (error) {
        console.error('Failed to load the journal drafts:', error);
      }
    };
    loadDrafts();
  }, []);

  // Debounced auto-save
  const saveDrafts = useCallback(
    debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
      try {
        await AsyncStorage.setItem('journalDrafts', JSON.stringify({
          entries,
          currentPage,
          totalPages
        }));
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1000),
    []
  );

  const handleChangeText = (text: string) => {
    const now = new Date();
    const updatedEntries = {...entries};
    
    // Initialize page data if it doesn't exist
    if (!updatedEntries[currentPage]) {
      updatedEntries[currentPage] = { content: '' };
    }
    
    // If this is the first content being added to the page, set the timestamp
    if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
      updatedEntries[currentPage] = {
        content: text,
        createdAt: now.toISOString()
      };
    } else {
      updatedEntries[currentPage] = {
        ...updatedEntries[currentPage],
        content: text
      };
    }
    
    setEntries(updatedEntries);
    saveDrafts(updatedEntries, currentPage, totalPages);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    const currentContent = entries[currentPage]?.content || '';
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    } else if (totalPages < MAX_PAGES && currentContent.trim().length > 0) {
      // Only create new page when right arrow is clicked and current page has content
      const newPage = currentPage + 1;
      setEntries({...entries, [newPage]: { content: '' }});
      setTotalPages(newPage);
      goToPage(newPage);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: false});
    }
    saveDrafts(entries, page, totalPages);
  };

  // Safely check if current page has content
  const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

  // Get timestamp for current page with fallback
  const getPageTimestamp = () => {
    const pageData = entries[currentPage] || { content: '' };
    if (!pageData.createdAt) {
      return formatTimestamp(new Date());
    }
    return formatTimestamp(new Date(pageData.createdAt));
  };

  const { date, time } = getPageTimestamp();

  // Toggle editing mode for the entire screen (touch anywhere to toggle)
  const toggleEditing = () => {
    if (isEditing) {
      Keyboard.dismiss();
    }
    setIsEditing(!isEditing);
  };

  // Toggle editing mode manually via the icon button
  const toggleEditingManually = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={toggleEditing}>
      <View style={styles.container}>
        {/* Top-left: Navigation and edit controls */}
        <View style={styles.navContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <Icon 
              name="chevron-left" 
              size={28} 
              color={currentPage === 1 ? '#ccc' : '#555'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={toggleEditingManually}
          >
            {isEditing ? (
              <Icon name="book-open-page-variant" size={28} color="#555" />
            ) : (
              <Icon name="pencil" size={28} color="#555" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={goToNextPage}
            disabled={
              (currentPage === totalPages && !currentPageHasContent) || 
              currentPage === MAX_PAGES
            }
          >
            <Icon 
              name="chevron-right" 
              size={28} 
              color={
                (currentPage === totalPages && !currentPageHasContent) || 
                currentPage === MAX_PAGES ? '#ccc' : '#555'
              } 
            />
          </TouchableOpacity>
        </View>

        {/* Top-right: Date and Time */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timestampText}>{time}</Text>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              multiline
              autoFocus
              value={entries[currentPage]?.content || ''}
              onChangeText={handleChangeText}
              placeholder="Write your thoughts..."
              placeholderTextColor="#aaa"
              textAlignVertical="top"
              scrollEnabled={true}
            />
          ) : (
            <ScrollView 
              ref={scrollViewRef}
              scrollEventThrottle={16}
            >
              <Text style={styles.text} onPress={() => setIsEditing(true)}>
                {entries[currentPage]?.content?.length > 0 
                  ? entries[currentPage].content 
                  : 'Tap anywhere to start writing...'}
              </Text>
            </ScrollView>
          )}
        </View>

        {/* Bottom-right: Page Count Indicator */}
        <View style={styles.pageCountContainer}>
          <Text style={styles.pageCountText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  navContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  navButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
    marginHorizontal: 10,
  },
  dateContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    color: '#999',
  },
  timestampText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  content: {
    flex: 1,
    marginTop: 40,
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    color: '#000',
    lineHeight: 28,
  },
  textInput: {
    fontSize: 18,
    color: '#000',
    lineHeight: 28,
    flex: 1,
  },
  pageCountContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  pageCountText: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default Home;