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
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { content: '' }});
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
//           // Convert string keys to numbers and ensure proper structure
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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



// Delete icon 

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
//   Alert,
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
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { content: '' }});
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
//           // Convert string keys to numbers and ensure proper structure
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       // Don't allow deleting the last page
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             // Determine new current page (prefer previous page if available)
//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;

//             // If we're deleting the last page, we need to adjust totalPages
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
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
//             style={styles.deleteButton} 
//             onPress={deleteCurrentPage}
//             disabled={totalPages === 1}
//           >
//             <Icon 
//               name="delete" 
//               size={24} 
//               color={totalPages === 1 ? '#ccc' : '#555'} 
//             />
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
//   deleteButton: {
//     padding: 5,
//     marginRight: 5,
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
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

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
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { title: '', content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Top Bar - Title (left) and Date/Time (right) */}
//         <View style={styles.topBar}>
//           <View style={styles.titleContainer}>
//             {isEditingTitle ? (
//               <TextInput
//                 ref={titleInputRef}
//                 style={styles.titleInput}
//                 value={entries[currentPage]?.title || ''}
//                 onChangeText={handleTitleChange}
//                 placeholder="Page title..."
//                 placeholderTextColor="#aaa"
//                 onBlur={() => setIsEditingTitle(false)}
//                 autoFocus
//               />
//             ) : (
//               <TouchableOpacity onPress={toggleTitleEditing}>
//                 <Text style={styles.titleText} numberOfLines={1}>
//                   {entries[currentPage]?.title || 'title'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text style={styles.timestampText}>{time}</Text>
//           </View>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus={!isEditingTitle}
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

//         {/* Bottom Bar - Icons (left) and Navigation + Page Count (right) */}
//         <View style={styles.bottomBar}>
//           <View style={styles.iconsContainer}>
//             <TouchableOpacity 
//               style={styles.editButton} 
//               onPress={toggleEditingManually}
//             >
//               {isEditing ? (
//                 <Icon name="book-open-page-variant" size={28} color="#555" />
//               ) : (
//                 <Icon name="pencil" size={28} color="#555" />
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.deleteButton} 
//               onPress={deleteCurrentPage}
//               disabled={totalPages === 1}
//             >
//               <Icon 
//                 name="delete" 
//                 size={24} 
//                 color={totalPages === 1 ? '#ccc' : '#555'} 
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.navAndPageContainer}>
//             <View style={styles.navArrowsContainer}>
//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Icon 
//                   name="chevron-left" 
//                   size={28} 
//                   color={currentPage === 1 ? '#ccc' : '#555'} 
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToNextPage}
//                 disabled={
//                   (currentPage === totalPages && !currentPageHasContent) || 
//                   currentPage === MAX_PAGES
//                 }
//               >
//                 <Icon 
//                   name="chevron-right" 
//                   size={28} 
//                   color={
//                     (currentPage === totalPages && !currentPageHasContent) || 
//                     currentPage === MAX_PAGES ? '#ccc' : '#555'
//                   } 
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.pageCountContainer}>
//               <Text style={styles.pageCountText}>
//                 Page {currentPage} of {totalPages}
//               </Text>
//             </View>
//           </View>
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
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   iconsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
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
//   pageCountContainer: {  // Added this missing style
//     alignItems: 'flex-end',
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
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

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
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { title: '', content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Icons at the very top */}
//         <View style={styles.topIconsContainer}>
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
//             style={styles.deleteButton} 
//             onPress={deleteCurrentPage}
//             disabled={totalPages === 1}
//           >
//             <Icon 
//               name="delete" 
//               size={24} 
//               color={totalPages === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Title and Date bar */}
//         <View style={styles.topBar}>
//           <View style={styles.titleContainer}>
//             {isEditingTitle ? (
//               <TextInput
//                 ref={titleInputRef}
//                 style={styles.titleInput}
//                 value={entries[currentPage]?.title || ''}
//                 onChangeText={handleTitleChange}
//                 placeholder="Page title..."
//                 placeholderTextColor="#aaa"
//                 onBlur={() => setIsEditingTitle(false)}
//                 autoFocus
//               />
//             ) : (
//               <TouchableOpacity onPress={toggleTitleEditing}>
//                 <Text style={styles.titleText} numberOfLines={1}>
//                   {entries[currentPage]?.title || 'Tap to add title...'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text style={styles.timestampText}>{time}</Text>
//           </View>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus={!isEditingTitle}
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

//         {/* Navigation and Page Count at bottom */}
//         <View style={styles.bottomBar}>
//           <View style={styles.navAndPageContainer}>
//             <View style={styles.navArrowsContainer}>
//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Icon 
//                   name="chevron-left" 
//                   size={28} 
//                   color={currentPage === 1 ? '#ccc' : '#555'} 
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToNextPage}
//                 disabled={
//                   (currentPage === totalPages && !currentPageHasContent) || 
//                   currentPage === MAX_PAGES
//                 }
//               >
//                 <Icon 
//                   name="chevron-right" 
//                   size={28} 
//                   color={
//                     (currentPage === totalPages && !currentPageHasContent) || 
//                     currentPage === MAX_PAGES ? '#ccc' : '#555'
//                   } 
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.pageCountContainer}>
//               <Text style={styles.pageCountText}>
//                 Page {currentPage} of {totalPages}
//               </Text>
//             </View>
//           </View>
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
//     paddingTop: 5,
//   },
//   topIconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
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
//     alignItems: 'flex-end',
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
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
//   isBookmarked?: boolean;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt,
//               bookmarked: (value as PageData).bookmarked || false
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//   const toggleBookmark = () => {
//     const updatedEntries = {
//       ...entries,
//       [currentPage]: {
//         ...entries[currentPage],
//         bookmarked: !entries[currentPage]?.bookmarked
//       }
//     };
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const handleChangeText = (text: string) => {
//     const now = new Date();
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

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
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { title: '', content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Icons at the very top */}
//         <View style={styles.topIconsContainer}>
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
//             style={styles.bookmarkButton} 
//             onPress={toggleBookmark}
//           >
//             <Icon 
//               name={entries[currentPage]?.bookmarked ? "bookmark" : "bookmark-outline"} 
//               size={24} 
//               color={entries[currentPage]?.bookmarked ? "#FFD700" : "#555"} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.deleteButton} 
//             onPress={deleteCurrentPage}
//             disabled={totalPages === 1}
//           >
//             <Icon 
//               name="delete" 
//               size={24} 
//               color={totalPages === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Title and Date bar */}
//         <View style={styles.topBar}>
//           <View style={styles.titleContainer}>
//             {isEditingTitle ? (
//               <TextInput
//                 ref={titleInputRef}
//                 style={styles.titleInput}
//                 value={entries[currentPage]?.title || ''}
//                 onChangeText={handleTitleChange}
//                 placeholder="title"
//                 placeholderTextColor="#aaa"
//                 onBlur={() => setIsEditingTitle(false)}
//                 autoFocus
//               />
//             ) : (
//               <TouchableOpacity onPress={toggleTitleEditing}>
//                 <Text style={styles.titleText} numberOfLines={1}>
//                   {entries[currentPage]?.title || ''}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text style={styles.timestampText}>{time}</Text>
//           </View>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus={!isEditingTitle}
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

//         {/* Navigation and Page Count at bottom */}
//         <View style={styles.bottomBar}>
//           <View style={styles.navAndPageContainer}>
//             <View style={styles.navArrowsContainer}>
//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Icon 
//                   name="chevron-left" 
//                   size={28} 
//                   color={currentPage === 1 ? '#ccc' : '#555'} 
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToNextPage}
//                 disabled={
//                   (currentPage === totalPages && !currentPageHasContent) || 
//                   currentPage === MAX_PAGES
//                 }
//               >
//                 <Icon 
//                   name="chevron-right" 
//                   size={28} 
//                   color={
//                     (currentPage === totalPages && !currentPageHasContent) || 
//                     currentPage === MAX_PAGES ? '#ccc' : '#555'
//                   } 
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.pageCountContainer}>
//               <Text style={styles.pageCountText}>
//                 Page {currentPage} of {totalPages}
//               </Text>
//             </View>
//           </View>
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
//     paddingTop: 0,
//   },
//   topIconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   bookmarkButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
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
//     alignItems: 'flex-end',
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
//   Alert,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
//   bookmarked?: boolean;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt,
//               bookmarked: (value as PageData).bookmarked || false
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//   const toggleBookmark = () => {
//     const updatedEntries = {
//       ...entries,
//       [currentPage]: {
//         ...entries[currentPage],
//         bookmarked: !entries[currentPage]?.bookmarked
//       }
//     };
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const handleChangeText = (text: string) => {
//     const now = new Date();
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

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
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { title: '', content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Icons at the very top */}
//         <View style={styles.topIconsContainer}>
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
//             style={styles.bookmarkButton} 
//             onPress={toggleBookmark}
//           >
//             <Icon 
//               name={entries[currentPage]?.bookmarked ? "bookmark" : "bookmark-outline"} 
//               size={24} 
//               color={entries[currentPage]?.bookmarked ? "#FFD700" : "#555"} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.deleteButton} 
//             onPress={deleteCurrentPage}
//             disabled={totalPages === 1}
//           >
//             <Icon 
//               name="delete" 
//               size={24} 
//               color={totalPages === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Title and Date bar */}
//         <View style={styles.topBar}>
//           <View style={styles.titleContainer}>
//             {isEditingTitle ? (
//               <TextInput
//                 ref={titleInputRef}
//                 style={styles.titleInput}
//                 value={entries[currentPage]?.title || ''}
//                 onChangeText={handleTitleChange}
//                 placeholder="Title"
//                 placeholderTextColor="#d3d3d3"
//                 onBlur={() => setIsEditingTitle(false)}
//                 autoFocus
//               />
//             ) : (
//               <TouchableOpacity onPress={toggleTitleEditing}>
//                 <Text 
//                   style={[
//                     styles.titleText,
//                     !entries[currentPage]?.title && styles.placeholderTitle
//                   ]} 
//                   numberOfLines={1}
//                 >
//                   {entries[currentPage]?.title || 'Title'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text style={styles.timestampText}>{time}</Text>
//           </View>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus={!isEditingTitle}
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

//         {/* Navigation and Page Count at bottom */}
//         <View style={styles.bottomBar}>
//           <View style={styles.navAndPageContainer}>
//             <View style={styles.navArrowsContainer}>
//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Icon 
//                   name="chevron-left" 
//                   size={28} 
//                   color={currentPage === 1 ? '#ccc' : '#555'} 
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToNextPage}
//                 disabled={
//                   (currentPage === totalPages && !currentPageHasContent) || 
//                   currentPage === MAX_PAGES
//                 }
//               >
//                 <Icon 
//                   name="chevron-right" 
//                   size={28} 
//                   color={
//                     (currentPage === totalPages && !currentPageHasContent) || 
//                     currentPage === MAX_PAGES ? '#ccc' : '#555'
//                   } 
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.pageCountContainer}>
//               <Text style={styles.pageCountText}>
//                 Page {currentPage} of {totalPages}
//               </Text>
//             </View>
//           </View>
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
//     paddingTop: 0,
//   },
//   topIconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   bookmarkButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   placeholderTitle: {
//     color: '#d3d3d3',
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
//     alignItems: 'flex-end',
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
// });

// export default Home;


// Filter functionality

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
//   Alert,
//   Modal,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
//   bookmarked?: boolean;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [showFilterModal, setShowFilterModal] = useState(false);
//   const [filteredPages, setFilteredPages] = useState<number[]>([]);
//   const [isFilterActive, setIsFilterActive] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt,
//               bookmarked: (value as PageData).bookmarked || false
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//   const toggleBookmark = () => {
//     const updatedEntries = {
//       ...entries,
//       [currentPage]: {
//         ...entries[currentPage],
//         bookmarked: !entries[currentPage]?.bookmarked
//       }
//     };
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const handleChangeText = (text: string) => {
//     const now = new Date();
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const goToPreviousPage = () => {
//     if (isFilterActive) {
//       const currentIndex = filteredPages.indexOf(currentPage);
//       if (currentIndex > 0) {
//         goToPage(filteredPages[currentIndex - 1]);
//       }
//     } else if (currentPage > 1) {
//       goToPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (isFilterActive) {
//       const currentIndex = filteredPages.indexOf(currentPage);
//       if (currentIndex < filteredPages.length - 1) {
//         goToPage(filteredPages[currentIndex + 1]);
//       }
//     } else {
//       const currentContent = entries[currentPage]?.content || '';
//       if (currentPage < totalPages) {
//         goToPage(currentPage + 1);
//       } else if (totalPages < MAX_PAGES && currentContent.trim().length > 0) {
//         const newPage = currentPage + 1;
//         setEntries({...entries, [newPage]: { title: '', content: '' }});
//         setTotalPages(newPage);
//         goToPage(newPage);
//       }
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const toggleFilterModal = () => {
//     setShowFilterModal(!showFilterModal);
//   };

//   const applyFilter = (filterType: 'today' | 'week' | 'month' | 'all') => {
//     const now = new Date();
//     let filtered: number[] = [];

//     if (filterType === 'all') {
//       setIsFilterActive(false);
//       setFilteredPages([]);
//       setShowFilterModal(false);
//       return;
//     }

//     Object.entries(entries).forEach(([pageNumber, pageData]) => {
//       if (!pageData.createdAt) return;

//       const pageDate = new Date(pageData.createdAt);
//       const timeDiff = now.getTime() - pageDate.getTime();
//       const daysDiff = timeDiff / (1000 * 3600 * 24);

//       if (filterType === 'today' && daysDiff < 1) {
//         filtered.push(parseInt(pageNumber));
//       } else if (filterType === 'week' && daysDiff < 7) {
//         filtered.push(parseInt(pageNumber));
//       } else if (filterType === 'month' && daysDiff < 30) {
//         filtered.push(parseInt(pageNumber));
//       }
//     });

//     filtered.sort((a, b) => a - b);
//     setFilteredPages(filtered);
//     setIsFilterActive(true);
//     if (filtered.length > 0) {
//       goToPage(filtered[0]);
//     }
//     setShowFilterModal(false);
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Icons at the very top */}
//         <View style={styles.topIconsContainer}>
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
//             style={styles.bookmarkButton} 
//             onPress={toggleBookmark}
//           >
//             <Icon 
//               name={entries[currentPage]?.bookmarked ? "bookmark" : "bookmark-outline"} 
//               size={24} 
//               color={entries[currentPage]?.bookmarked ? "#FFD700" : "#555"} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.deleteButton} 
//             onPress={deleteCurrentPage}
//             disabled={totalPages === 1}
//           >
//             <Icon 
//               name="delete" 
//               size={24} 
//               color={totalPages === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.filterButton} 
//             onPress={toggleFilterModal}
//           >
//             <Icon 
//               name="filter" 
//               size={24} 
//               color={isFilterActive ? "#FFD700" : "#555"} 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Title and Date bar */}
//         <View style={styles.topBar}>
//           <View style={styles.titleContainer}>
//             {isEditingTitle ? (
//               <TextInput
//                 ref={titleInputRef}
//                 style={styles.titleInput}
//                 value={entries[currentPage]?.title || ''}
//                 onChangeText={handleTitleChange}
//                 placeholder="Enter page title..."
//                 placeholderTextColor="#d3d3d3"
//                 onBlur={() => setIsEditingTitle(false)}
//                 autoFocus
//               />
//             ) : (
//               <TouchableOpacity onPress={toggleTitleEditing}>
//                 <Text 
//                   style={[
//                     styles.titleText,
//                     !entries[currentPage]?.title && styles.placeholderTitle
//                   ]} 
//                   numberOfLines={1}
//                 >
//                   {entries[currentPage]?.title || 'Enter page title...'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text style={styles.timestampText}>{time}</Text>
//           </View>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus={!isEditingTitle}
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

//         {/* Navigation and Page Count at bottom */}
//         <View style={styles.bottomBar}>
//           <View style={styles.navAndPageContainer}>
//             <View style={styles.navArrowsContainer}>
//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToPreviousPage}
//                 disabled={
//                   isFilterActive 
//                     ? filteredPages.indexOf(currentPage) <= 0 
//                     : currentPage === 1
//                 }
//               >
//                 <Icon 
//                   name="chevron-left" 
//                   size={28} 
//                   color={
//                     isFilterActive 
//                       ? filteredPages.indexOf(currentPage) <= 0 
//                         ? '#ccc' 
//                         : '#555'
//                       : currentPage === 1 
//                         ? '#ccc' 
//                         : '#555'
//                   } 
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToNextPage}
//                 disabled={
//                   isFilterActive
//                     ? filteredPages.indexOf(currentPage) >= filteredPages.length - 1
//                     : (currentPage === totalPages && !currentPageHasContent) || 
//                       currentPage === MAX_PAGES
//                 }
//               >
//                 <Icon 
//                   name="chevron-right" 
//                   size={28} 
//                   color={
//                     isFilterActive
//                       ? filteredPages.indexOf(currentPage) >= filteredPages.length - 1
//                         ? '#ccc'
//                         : '#555'
//                       : (currentPage === totalPages && !currentPageHasContent) || 
//                         currentPage === MAX_PAGES 
//                         ? '#ccc' 
//                         : '#555'
//                   } 
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.pageCountContainer}>
//               <Text style={styles.pageCountText}>
//                 {isFilterActive 
//                   ? `Page ${filteredPages.indexOf(currentPage) + 1} of ${filteredPages.length}`
//                   : `Page ${currentPage} of ${totalPages}`}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Filter Modal */}
//         <Modal
//           visible={showFilterModal}
//           transparent={true}
//           animationType="fade"
//           onRequestClose={toggleFilterModal}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.filterModal}>
//               <Text style={styles.filterTitle}>Filter Pages</Text>

//               <TouchableOpacity 
//                 style={styles.filterOption} 
//                 onPress={() => applyFilter('today')}
//               >
//                 <Text style={styles.filterOptionText}>Today</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.filterOption} 
//                 onPress={() => applyFilter('week')}
//               >
//                 <Text style={styles.filterOptionText}>Last 7 Days</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.filterOption} 
//                 onPress={() => applyFilter('month')}
//               >
//                 <Text style={styles.filterOptionText}>Last 30 Days</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.filterOption} 
//                 onPress={() => applyFilter('all')}
//               >
//                 <Text style={styles.filterOptionText}>All Pages</Text>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.filterCancel} 
//                 onPress={toggleFilterModal}
//               >
//                 <Text style={styles.filterCancelText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
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
//   topIconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   bookmarkButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   filterButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   placeholderTitle: {
//     color: '#d3d3d3',
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
//     alignItems: 'flex-end',
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filterModal: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     width: '80%',
//   },
//   filterTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   filterOption: {
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   filterOptionText: {
//     fontSize: 16,
//     color: '#555',
//   },
//   filterCancel: {
//     marginTop: 20,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   filterCancelText: {
//     fontSize: 16,
//     color: '#888',
//   },
// });

// export default Home;


// Calendar 

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
//   Alert,
//   Modal,
//   FlatList,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Calendar } from 'react-native-calendars';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
//   bookmarked?: boolean;
// }

// interface MarkedDate {
//   selected: boolean;
//   marked?: boolean;
//   selectedColor?: string;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [showCalendarModal, setShowCalendarModal] = useState(false);
//   const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
//   const [pagesByDate, setPagesByDate] = useState<Record<string, {pageNumber: number, title: string}[]>>({});
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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

//   // Prepare calendar data when entries change
//   useEffect(() => {
//     const dates: Record<string, MarkedDate> = {};
//     const byDate: Record<string, {pageNumber: number, title: string}[]> = {};

//     Object.entries(entries).forEach(([pageNumber, pageData]) => {
//       if (!pageData.createdAt) return;

//       const date = new Date(pageData.createdAt);
//       const dateString = date.toISOString().split('T')[0];

//       // Mark dates that have entries
//       dates[dateString] = {
//         selected: false,
//         marked: true,
//       };

//       // Group pages by date
//       if (!byDate[dateString]) {
//         byDate[dateString] = [];
//       }
//       byDate[dateString].push({
//         pageNumber: parseInt(pageNumber),
//         title: pageData.title || 'Untitled'
//       });
//     });

//     setMarkedDates(dates);
//     setPagesByDate(byDate);
//   }, [entries]);

//   // Load drafts when the screen mounts
//   useEffect(() => {
//     const loadDrafts = async () => {
//       try {
//         const storedDrafts = await AsyncStorage.getItem('journalDrafts');
//         if (storedDrafts !== null) {
//           const parsedDrafts = JSON.parse(storedDrafts);
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt,
//               bookmarked: (value as PageData).bookmarked || false
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
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
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//   const toggleBookmark = () => {
//     const updatedEntries = {
//       ...entries,
//       [currentPage]: {
//         ...entries[currentPage],
//         bookmarked: !entries[currentPage]?.bookmarked
//       }
//     };
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const handleChangeText = (text: string) => {
//     const now = new Date();
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

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
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { title: '', content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const toggleCalendarModal = () => {
//     setShowCalendarModal(!showCalendarModal);
//   };

//   const handleDayPress = (day: {dateString: string}) => {
//     const pagesForDate = pagesByDate[day.dateString];
//     if (pagesForDate && pagesForDate.length > 0) {
//       goToPage(pagesForDate[0].pageNumber);
//     }
//     setShowCalendarModal(false);
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   const renderPageItem = ({item}: {item: {pageNumber: number, title: string}}) => (
//     <TouchableOpacity 
//       style={styles.pageItem} 
//       onPress={() => {
//         goToPage(item.pageNumber);
//         setShowCalendarModal(false);
//       }}
//     >
//       <Text style={styles.pageItemText}>{item.title}</Text>
//       <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <TouchableWithoutFeedback onPress={toggleEditing}>
//       <View style={styles.container}>
//         {/* Icons at the very top */}
//         <View style={styles.topIconsContainer}>
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
//             style={styles.bookmarkButton} 
//             onPress={toggleBookmark}
//           >
//             <Icon 
//               name={entries[currentPage]?.bookmarked ? "bookmark" : "bookmark-outline"} 
//               size={24} 
//               color={entries[currentPage]?.bookmarked ? "#FFD700" : "#555"} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.deleteButton} 
//             onPress={deleteCurrentPage}
//             disabled={totalPages === 1}
//           >
//             <Icon 
//               name="delete" 
//               size={24} 
//               color={totalPages === 1 ? '#ccc' : '#555'} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.calendarButton} 
//             onPress={toggleCalendarModal}
//           >
//             <Icon 
//               name="calendar-month" 
//               size={24} 
//               color="#555" 
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Title and Date bar */}
//         <View style={styles.topBar}>
//           <View style={styles.titleContainer}>
//             {isEditingTitle ? (
//               <TextInput
//                 ref={titleInputRef}
//                 style={styles.titleInput}
//                 value={entries[currentPage]?.title || ''}
//                 onChangeText={handleTitleChange}
//                 placeholder="Title"
//                 placeholderTextColor="#d3d3d3"
//                 onBlur={() => setIsEditingTitle(false)}
//                 autoFocus
//               />
//             ) : (
//               <TouchableOpacity onPress={toggleTitleEditing}>
//                 <Text 
//                   style={[
//                     styles.titleText,
//                     !entries[currentPage]?.title && styles.placeholderTitle
//                   ]} 
//                   numberOfLines={1}
//                 >
//                   {entries[currentPage]?.title || 'Title'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{date}</Text>
//             <Text style={styles.timestampText}>{time}</Text>
//           </View>
//         </View>

//         {/* Main Content Area */}
//         <View style={styles.content}>
//           {isEditing ? (
//             <TextInput
//               style={styles.textInput}
//               multiline
//               autoFocus={!isEditingTitle}
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

//         {/* Navigation and Page Count at bottom */}
//         <View style={styles.bottomBar}>
//           <View style={styles.navAndPageContainer}>
//             <View style={styles.navArrowsContainer}>
//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToPreviousPage}
//                 disabled={currentPage === 1}
//               >
//                 <Icon 
//                   name="chevron-left" 
//                   size={28} 
//                   color={currentPage === 1 ? '#ccc' : '#555'} 
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.navButton} 
//                 onPress={goToNextPage}
//                 disabled={
//                   (currentPage === totalPages && !currentPageHasContent) || 
//                   currentPage === MAX_PAGES
//                 }
//               >
//                 <Icon 
//                   name="chevron-right" 
//                   size={28} 
//                   color={
//                     (currentPage === totalPages && !currentPageHasContent) || 
//                     currentPage === MAX_PAGES ? '#ccc' : '#555'
//                   } 
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.pageCountContainer}>
//               <Text style={styles.pageCountText}>
//                 Page {currentPage} of {totalPages}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Calendar Modal */}
//         <Modal
//           visible={showCalendarModal}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={toggleCalendarModal}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.calendarModal}>
//               <View style={styles.calendarHeader}>
//                 <Text style={styles.calendarTitle}>Journal Entries</Text>
//                 <TouchableOpacity onPress={toggleCalendarModal}>
//                   <Icon name="close" size={24} color="#555" />
//                 </TouchableOpacity>
//               </View>

//               <Calendar
//                 markedDates={markedDates}
//                 onDayPress={handleDayPress}
//                 theme={{
//                   calendarBackground: '#fff',
//                   selectedDayBackgroundColor: '#FFD700',
//                   todayTextColor: '#FFD700',
//                   dayTextColor: '#333',
//                   textDisabledColor: '#ccc',
//                   arrowColor: '#555',
//                   monthTextColor: '#555',
//                   textDayFontWeight: '400',
//                   textMonthFontWeight: 'bold',
//                   textDayHeaderFontWeight: 'bold',
//                 }}
//               />

//               <View style={styles.pagesList}>
//                 <Text style={styles.pagesListTitle}>Pages by Date</Text>
//                 <FlatList
//                   data={Object.entries(pagesByDate)
//                     .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
//                     .flatMap(([date, pages]) => 
//                       pages.map(page => ({
//                         ...page,
//                         date
//                       }))
//                     )}
//                   keyExtractor={(item) => `${item.date}-${item.pageNumber}`}
//                   renderItem={({item}) => (
//                     <TouchableOpacity 
//                       style={[
//                         styles.pageItem,
//                         item.pageNumber === currentPage && styles.currentPageItem
//                       ]} 
//                       onPress={() => {
//                         goToPage(item.pageNumber);
//                         setShowCalendarModal(false);
//                       }}
//                     >
//                       <Text style={styles.pageItemDate}>
//                         {new Date(item.date).toLocaleDateString(undefined, {
//                           weekday: 'short',
//                           month: 'short',
//                           day: 'numeric'
//                         })}
//                       </Text>
//                       <Text style={styles.pageItemText}>{item.title}</Text>
//                       <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 0,
//   },
//   topIconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   bookmarkButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   calendarButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   placeholderTitle: {
//     color: '#d3d3d3',
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
//     alignItems: 'flex-end',
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   calendarModal: {
//     backgroundColor: '#fff',
//     flex: 1,
//     marginTop: 50,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   calendarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   calendarTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#555',
//   },
//   pagesList: {
//     flex: 1,
//     marginTop: 20,
//   },
//   pagesListTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#555',
//   },
//   pageItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   currentPageItem: {
//     backgroundColor: '#FFF9C4',
//   },
//   pageItemDate: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 5,
//   },
//   pageItemText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   pageItemNumber: {
//     fontSize: 14,
//     color: '#aaa',
//     marginTop: 5,
//   },
// });

// export default Home;


// Swipe

// import 'react-native-gesture-handler'; 
// import { PanGestureHandler, State } from 'react-native-gesture-handler';
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
//   Alert,
//   Modal,
//   FlatList,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Calendar } from 'react-native-calendars';

// const MAX_PAGES = 10;

// interface PageData {
//   title: string;
//   content: string;
//   createdAt?: string;
//   bookmarked?: boolean;
// }

// interface MarkedDate {
//   selected: boolean;
//   marked?: boolean;
//   selectedColor?: string;
// }

// const Home = () => {
//   const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '' }});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [showCalendarModal, setShowCalendarModal] = useState(false);
//   const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
//   const [pagesByDate, setPagesByDate] = useState<Record<string, {pageNumber: number, title: string}[]>>({});
//   const scrollViewRef = useRef<ScrollView>(null);
//   const titleInputRef = useRef<TextInput>(null);

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

//   useEffect(() => {
//     const dates: Record<string, MarkedDate> = {};
//     const byDate: Record<string, {pageNumber: number, title: string}[]> = {};

//     Object.entries(entries).forEach(([pageNumber, pageData]) => {
//       if (!pageData.createdAt) return;

//       const date = new Date(pageData.createdAt);
//       const dateString = date.toISOString().split('T')[0];

//       dates[dateString] = {
//         selected: false,
//         marked: true,
//       };

//       if (!byDate[dateString]) {
//         byDate[dateString] = [];
//       }
//       byDate[dateString].push({
//         pageNumber: parseInt(pageNumber),
//         title: pageData.title || 'Untitled'
//       });
//     });

//     setMarkedDates(dates);
//     setPagesByDate(byDate);
//   }, [entries]);

//   useEffect(() => {
//     const loadDrafts = async () => {
//       try {
//         const storedDrafts = await AsyncStorage.getItem('journalDrafts');
//         if (storedDrafts !== null) {
//           const parsedDrafts = JSON.parse(storedDrafts);
//           const sanitizedEntries = Object.entries(parsedDrafts.entries || {}).reduce((acc, [key, value]) => {
//             const pageNumber = parseInt(key, 10);
//             acc[pageNumber] = {
//               title: (value as PageData).title || '',
//               content: (value as PageData).content || '',
//               createdAt: (value as PageData).createdAt,
//               bookmarked: (value as PageData).bookmarked || false
//             };
//             return acc;
//           }, {} as Record<number, PageData>);

//           setEntries(sanitizedEntries || {1: { title: '', content: '' }});
//           setCurrentPage(parsedDrafts.currentPage || 1);
//           setTotalPages(parsedDrafts.totalPages || 1);
//         }
//       } catch (error) {
//         console.error('Failed to load the journal drafts:', error);
//       }
//     };
//     loadDrafts();
//   }, []);

//   const saveDrafts = useCallback(
//     debounce(async (entries: Record<number, PageData>, currentPage: number, totalPages: number) => {
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

//   const toggleBookmark = () => {
//     const updatedEntries = {
//       ...entries,
//       [currentPage]: {
//         ...entries[currentPage],
//         bookmarked: !entries[currentPage]?.bookmarked
//       }
//     };
//     setEntries(updatedEntries);
//     saveDrafts(updatedEntries, currentPage, totalPages);
//   };

//   const handleChangeText = (text: string) => {
//     const now = new Date();
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//       updatedEntries[currentPage] = {
//         ...updatedEntries[currentPage],
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

//   const handleTitleChange = (text: string) => {
//     const updatedEntries = {...entries};

//     if (!updatedEntries[currentPage]) {
//       updatedEntries[currentPage] = { title: '', content: '' };
//     }

//     updatedEntries[currentPage] = {
//       ...updatedEntries[currentPage],
//       title: text
//     };

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
//       const newPage = currentPage + 1;
//       setEntries({...entries, [newPage]: { title: '', content: '' }});
//       setTotalPages(newPage);
//       goToPage(newPage);
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(page);
//     setIsEditingTitle(false);
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({y: 0, animated: false});
//     }
//     saveDrafts(entries, page, totalPages);
//   };

//   const deleteCurrentPage = () => {
//     if (totalPages === 1) {
//       Alert.alert(
//         "Cannot Delete Page",
//         "You must have at least one page.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     Alert.alert(
//       "Delete Page",
//       "Are you sure you want to delete this page?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel"
//         },
//         { 
//           text: "Delete", 
//           onPress: () => {
//             const newEntries = {...entries};
//             delete newEntries[currentPage];

//             let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//             const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//             setEntries(newEntries);
//             setCurrentPage(newCurrentPage);
//             setTotalPages(newTotalPages);
//             saveDrafts(newEntries, newCurrentPage, newTotalPages);
//           },
//           style: "destructive"
//         }
//       ]
//     );
//   };

//   const toggleCalendarModal = () => {
//     setShowCalendarModal(!showCalendarModal);
//   };

//   const handleDayPress = (day: {dateString: string}) => {
//     const pagesForDate = pagesByDate[day.dateString];
//     if (pagesForDate && pagesForDate.length > 0) {
//       goToPage(pagesForDate[0].pageNumber);
//     }
//     setShowCalendarModal(false);
//   };

//   const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//   const getPageTimestamp = () => {
//     const pageData = entries[currentPage] || { title: '', content: '' };
//     if (!pageData.createdAt) {
//       return formatTimestamp(new Date());
//     }
//     return formatTimestamp(new Date(pageData.createdAt));
//   };

//   const { date, time } = getPageTimestamp();

//   const toggleEditing = () => {
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//     setIsEditing(!isEditing);
//   };

//   const toggleEditingManually = () => {
//     setIsEditing(!isEditing);
//     if (isEditing) {
//       Keyboard.dismiss();
//     }
//   };

//   const toggleTitleEditing = () => {
//     setIsEditingTitle(!isEditingTitle);
//     if (!isEditingTitle && titleInputRef.current) {
//       titleInputRef.current.focus();
//     }
//   };

//   const renderPageItem = ({item}: {item: {pageNumber: number, title: string}}) => (
//     <TouchableOpacity 
//       style={styles.pageItem} 
//       onPress={() => {
//         goToPage(item.pageNumber);
//         setShowCalendarModal(false);
//       }}
//     >
//       <Text style={styles.pageItemText}>{item.title}</Text>
//       <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <PanGestureHandler
//       onHandlerStateChange={({ nativeEvent }) => {
//         if (nativeEvent.state === State.END) {
//           if (nativeEvent.translationX > 50) {
//             goToPreviousPage();
//           } else if (nativeEvent.translationX < -50) {
//             goToNextPage();
//           }
//         }
//       }}
//     >
//       <TouchableWithoutFeedback onPress={toggleEditing}>
//         <View style={styles.container}>
//           <View style={styles.topIconsContainer}>
//             <TouchableOpacity 
//               style={styles.editButton} 
//               onPress={toggleEditingManually}
//             >
//               {isEditing ? (
//                 <Icon name="book-open-page-variant" size={28} color="#555" />
//               ) : (
//                 <Icon name="pencil" size={28} color="#555" />
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.bookmarkButton} 
//               onPress={toggleBookmark}
//             >
//               <Icon 
//                 name={entries[currentPage]?.bookmarked ? "bookmark" : "bookmark-outline"} 
//                 size={24} 
//                 color={entries[currentPage]?.bookmarked ? "#FFD700" : "#555"} 
//               />
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.deleteButton} 
//               onPress={deleteCurrentPage}
//               disabled={totalPages === 1}
//             >
//               <Icon 
//                 name="delete" 
//                 size={24} 
//                 color={totalPages === 1 ? '#ccc' : '#555'} 
//               />
//             </TouchableOpacity>

//             <TouchableOpacity 
//               style={styles.calendarButton} 
//               onPress={toggleCalendarModal}
//             >
//               <Icon 
//                 name="calendar-month" 
//                 size={24} 
//                 color="#555" 
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.topBar}>
//             <View style={styles.titleContainer}>
//               {isEditingTitle ? (
//                 <TextInput
//                   ref={titleInputRef}
//                   style={styles.titleInput}
//                   value={entries[currentPage]?.title || ''}
//                   onChangeText={handleTitleChange}
//                   placeholder="Title"
//                   placeholderTextColor="#d3d3d3"
//                   onBlur={() => setIsEditingTitle(false)}
//                   autoFocus
//                 />
//               ) : (
//                 <TouchableOpacity onPress={toggleTitleEditing}>
//                   <Text 
//                     style={[
//                       styles.titleText,
//                       !entries[currentPage]?.title && styles.placeholderTitle
//                     ]} 
//                     numberOfLines={1}
//                   >
//                     {entries[currentPage]?.title || 'Title'}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </View>

//             <View style={styles.dateContainer}>
//               <Text style={styles.dateText}>{date}</Text>
//               <Text style={styles.timestampText}>{time}</Text>
//             </View>
//           </View>

//           <View style={styles.content}>
//             {isEditing ? (
//               <TextInput
//                 style={styles.textInput}
//                 multiline
//                 autoFocus={!isEditingTitle}
//                 value={entries[currentPage]?.content || ''}
//                 onChangeText={handleChangeText}
//                 placeholder="Write your thoughts..."
//                 placeholderTextColor="#aaa"
//                 textAlignVertical="top"
//                 scrollEnabled={true}
//               />
//             ) : (
//               <ScrollView 
//                 ref={scrollViewRef}
//                 scrollEventThrottle={16}
//               >
//                 <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                   {entries[currentPage]?.content?.length > 0 
//                     ? entries[currentPage].content 
//                     : 'Tap anywhere to start writing...'}
//                 </Text>
//               </ScrollView>
//             )}
//           </View>

//           <View style={styles.bottomBar}>
//             <View style={styles.navAndPageContainer}>
//               <View style={styles.navArrowsContainer}>
//                 <TouchableOpacity 
//                   style={styles.navButton} 
//                   onPress={goToPreviousPage}
//                   disabled={currentPage === 1}
//                 >
//                   <Icon 
//                     name="chevron-left" 
//                     size={28} 
//                     color={currentPage === 1 ? '#ccc' : '#555'} 
//                   />
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                   style={styles.navButton} 
//                   onPress={goToNextPage}
//                   disabled={
//                     (currentPage === totalPages && !currentPageHasContent) || 
//                     currentPage === MAX_PAGES
//                   }
//                 >
//                   <Icon 
//                     name="chevron-right" 
//                     size={28} 
//                     color={
//                       (currentPage === totalPages && !currentPageHasContent) || 
//                       currentPage === MAX_PAGES ? '#ccc' : '#555'
//                     } 
//                   />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.pageCountContainer}>
//                 <Text style={styles.pageCountText}>
//                   Page {currentPage} of {totalPages}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <Modal
//             visible={showCalendarModal}
//             transparent={true}
//             animationType="slide"
//             onRequestClose={toggleCalendarModal}
//           >
//             <View style={styles.modalOverlay}>
//               <View style={styles.calendarModal}>
//                 <View style={styles.calendarHeader}>
//                   <Text style={styles.calendarTitle}>Journal Entries</Text>
//                   <TouchableOpacity onPress={toggleCalendarModal}>
//                     <Icon name="close" size={24} color="#555" />
//                   </TouchableOpacity>
//                 </View>

//                 <Calendar
//                   markedDates={markedDates}
//                   onDayPress={handleDayPress}
//                   theme={{
//                     calendarBackground: '#fff',
//                     selectedDayBackgroundColor: '#FFD700',
//                     todayTextColor: '#FFD700',
//                     dayTextColor: '#333',
//                     textDisabledColor: '#ccc',
//                     arrowColor: '#555',
//                     monthTextColor: '#555',
//                     textDayFontWeight: '400',
//                     textMonthFontWeight: 'bold',
//                     textDayHeaderFontWeight: 'bold',
//                   }}
//                 />

//                 <View style={styles.pagesList}>
//                   <Text style={styles.pagesListTitle}>Pages by Date</Text>
//                   <FlatList
//                     data={Object.entries(pagesByDate)
//                       .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
//                       .flatMap(([date, pages]) => 
//                         pages.map(page => ({
//                           ...page,
//                           date
//                         }))
//                       )}
//                     keyExtractor={(item) => `${item.date}-${item.pageNumber}`}
//                     renderItem={({item}) => (
//                       <TouchableOpacity 
//                         style={[
//                           styles.pageItem,
//                           item.pageNumber === currentPage && styles.currentPageItem
//                         ]} 
//                         onPress={() => {
//                           goToPage(item.pageNumber);
//                           setShowCalendarModal(false);
//                         }}
//                       >
//                         <Text style={styles.pageItemDate}>
//                           {new Date(item.date).toLocaleDateString(undefined, {
//                             weekday: 'short',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </Text>
//                         <Text style={styles.pageItemText}>{item.title}</Text>
//                         <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
//                       </TouchableOpacity>
//                     )}
//                   />
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       </TouchableWithoutFeedback>
//     </PanGestureHandler>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 0,
//   },
//   topIconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     marginBottom: 10,
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 10,
//   },
//   dateContainer: {
//     alignItems: 'flex-end',
//   },
//   content: {
//     flex: 1,
//     marginBottom: 10,
//   },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end',
//     marginTop: 10,
//   },
//   navAndPageContainer: {
//     alignItems: 'flex-end',
//   },
//   navArrowsContainer: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   navButton: {
//     padding: 5,
//     marginHorizontal: 5,
//   },
//   editButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   bookmarkButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   deleteButton: {
//     padding: 5,
//     marginRight: 15,
//   },
//   calendarButton: {
//     padding: 5,
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
//   titleInput: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     paddingVertical: 5,
//   },
//   placeholderTitle: {
//     color: '#d3d3d3',
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
//     alignItems: 'flex-end',
//   },
//   pageCountText: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   calendarModal: {
//     backgroundColor: '#fff',
//     flex: 1,
//     marginTop: 50,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   calendarHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   calendarTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#555',
//   },
//   pagesList: {
//     flex: 1,
//     marginTop: 20,
//   },
//   pagesListTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#555',
//   },
//   pageItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   currentPageItem: {
//     backgroundColor: '#FFF9C4',
//   },
//   pageItemDate: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 5,
//   },
//   pageItemText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   pageItemNumber: {
//     fontSize: 14,
//     color: '#aaa',
//     marginTop: 5,
//   },
// });

// export default Home;



// DB





// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     StyleSheet,
//     TouchableWithoutFeedback,
//     TouchableOpacity,
//     Keyboard,
//     ScrollView,
//     Alert,
//     Modal,
//     FlatList,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import debounce from 'lodash.debounce';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Calendar } from 'react-native-calendars';
// import { createJournalPage, updateJournalPage, getUserJournalPages } from '@/lib/appwrite/journals'
// import { useGlobalContext } from '@/context/GlobalProvider';


// const MAX_PAGES = 10;

// interface PageData {
//     id?: string;
//     title: string;
//     content: string;
//     createdAt?: string;
//     bookmarked?: boolean;
// }

// interface MarkedDate {
//     selected: boolean;
//     marked?: boolean;
//     selectedColor?: string;
// }

// const Home = () => {
//     const [entries, setEntries] = useState<Record<number, PageData>>({ 1: { title: '', content: '' } });
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isEditingTitle, setIsEditingTitle] = useState(false);
//     const [showCalendarModal, setShowCalendarModal] = useState(false);
//     const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
//     const [pagesByDate, setPagesByDate] = useState<Record<string, { pageNumber: number, title: string }[]>>({});
//     const [loading, setLoading] = useState(true);
//     const scrollViewRef = useRef<ScrollView>(null);
//     const titleInputRef = useRef<TextInput>(null);
//     const { user } = useGlobalContext();
//     const userId = user ? user.$id : null;

//     // Format date and time
//     const formatTimestamp = (date: Date) => {
//         return {
//             date: date.toLocaleDateString(undefined, {
//                 weekday: 'short',
//                 month: 'short',
//                 day: 'numeric',
//                 year: 'numeric',
//             }),
//             time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
//         };
//     };

//     // Prepare calendar data when entries change
//     useEffect(() => {
//         const dates: Record<string, MarkedDate> = {};
//         const byDate: Record<string, { pageNumber: number, title: string }[]> = {};

//         Object.entries(entries).forEach(([pageNumber, pageData]) => {
//             if (!pageData.createdAt) return;

//             const date = new Date(pageData.createdAt);
//             const dateString = date.toISOString().split('T')[0];

//             // Mark dates that have entries
//             dates[dateString] = {
//                 selected: false,
//                 marked: true,
//             };

//             // Group pages by date
//             if (!byDate[dateString]) {
//                 byDate[dateString] = [];
//             }
//             byDate[dateString].push({
//                 pageNumber: parseInt(pageNumber),
//                 title: pageData.title || 'Untitled'
//             });
//         });

//         setMarkedDates(dates);
//         setPagesByDate(byDate);
//     }, [entries]);

//     // Load journal pages when the screen mounts
//     useEffect(() => {
//         const loadJournalPages = async () => {
//             try {
//                 setLoading(true);
//                 const pages = await getUserJournalPages(userId);

//                 if (pages.length > 0) {
//                     const newEntries: Record<number, PageData> = {};
//                     pages.forEach((page, index) => {
//                         newEntries[index + 1] = {
//                             id: page.$id,
//                             title: page.pageTitle,
//                             content: page.pageContent,
//                             createdAt: page.$createdAt,
//                             bookmarked: page.isBookmarked
//                         };
//                     });

//                     setEntries(newEntries);
//                     setTotalPages(pages.length);

//                     // Check if we need to add an empty page
//                     if (pages.length < MAX_PAGES && !newEntries[pages.length + 1]) {
//                         newEntries[pages.length + 1] = { title: '', content: '' };
//                         setEntries(newEntries);
//                     }
//                 } else {
//                     // No pages yet, start with an empty one
//                     setEntries({ 1: { title: '', content: '' } });
//                 }
//             } catch (error) {
//                 console.error('Failed to load journal pages:', error);
//                 // Fallback to local storage if there's an error
//                 const storedDrafts = await AsyncStorage.getItem('journalDrafts');
//                 if (storedDrafts !== null) {
//                     const parsedDrafts = JSON.parse(storedDrafts);
//                     setEntries(parsedDrafts.entries || { 1: { title: '', content: '' } });
//                     setCurrentPage(parsedDrafts.currentPage || 1);
//                     setTotalPages(parsedDrafts.totalPages || 1);
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadJournalPages();
//     }, [userId]);

//     // Save to database with debounce
//     const saveToDatabase = useCallback(
//         debounce(async (pageNumber: number, pageData: PageData) => {
//             try {
//                 if (!userId) return;

//                 const { id, title, content, bookmarked, createdAt } = pageData;

//                 if (content.trim().length > 0) {
//                     if (id) {
//                         // Update existing page
//                         await updateJournalPage(id, {
//                             pageTitle: title,
//                             pageContent: content,
//                             isBookmarked: bookmarked
//                         });
//                     } else {
//                         // Create new page
//                         const newPage = await createJournalPage(
//                             userId,
//                             title,
//                             content,
//                             bookmarked || false
//                         );

//                         // Update local entries with the new ID
//                         setEntries(prev => ({
//                             ...prev,
//                             [pageNumber]: {
//                                 ...prev[pageNumber],
//                                 id: newPage.$id,
//                                 createdAt: newPage.createdAt
//                             }
//                         }));
//                     }
//                 }
//             } catch (error) {
//                 console.error('Failed to save to database:', error);
//                 // Fallback to local storage
//                 await AsyncStorage.setItem('journalDrafts', JSON.stringify({
//                     entries,
//                     currentPage,
//                     totalPages
//                 }));
//             }
//         }, 1500),
//         [userId]
//     );

//     const toggleBookmark = async () => {
//         const updatedEntries = {
//             ...entries,
//             [currentPage]: {
//                 ...entries[currentPage],
//                 bookmarked: !entries[currentPage]?.bookmarked
//             }
//         };
//         setEntries(updatedEntries);

//         // Save to database
//         if (entries[currentPage]?.id) {
//             await updateJournalPage(entries[currentPage].id!, {
//                 isBookmarked: !entries[currentPage]?.bookmarked
//             });
//         } else {
//             saveToDatabase(currentPage, updatedEntries[currentPage]);
//         }
//     };

//     const handleChangeText = (text: string) => {
//         const now = new Date();
//         const updatedEntries = { ...entries };

//         if (!updatedEntries[currentPage]) {
//             updatedEntries[currentPage] = { title: '', content: '' };
//         }

//         if (!updatedEntries[currentPage].createdAt && text.trim().length > 0) {
//             updatedEntries[currentPage] = {
//                 ...updatedEntries[currentPage],
//                 content: text,
//                 createdAt: now.toISOString()
//             };
//         } else {
//             updatedEntries[currentPage] = {
//                 ...updatedEntries[currentPage],
//                 content: text
//             };
//         }

//         setEntries(updatedEntries);
//         saveToDatabase(currentPage, updatedEntries[currentPage]);
//     };

//     const handleTitleChange = (text: string) => {
//         const updatedEntries = { ...entries };

//         if (!updatedEntries[currentPage]) {
//             updatedEntries[currentPage] = { title: '', content: '' };
//         }

//         updatedEntries[currentPage] = {
//             ...updatedEntries[currentPage],
//             title: text
//         };

//         setEntries(updatedEntries);
//         saveToDatabase(currentPage, updatedEntries[currentPage]);
//     };

//     const goToPreviousPage = () => {
//         if (currentPage > 1) {
//             goToPage(currentPage - 1);
//         }
//     };

//     const goToNextPage = () => {
//         const currentContent = entries[currentPage]?.content || '';
//         if (currentPage < totalPages) {
//             goToPage(currentPage + 1);
//         } else if (totalPages < MAX_PAGES && currentContent.trim().length > 0) {
//             const newPage = currentPage + 1;
//             setEntries({ ...entries, [newPage]: { title: '', content: '' } });
//             setTotalPages(newPage);
//             goToPage(newPage);
//         }
//     };

//     const goToPage = (page: number) => {
//         setCurrentPage(page);
//         setIsEditingTitle(false);
//         if (scrollViewRef.current) {
//             scrollViewRef.current.scrollTo({ y: 0, animated: false });
//         }
//     };

//     const deleteCurrentPage = async () => {
//         if (totalPages === 1) {
//             Alert.alert(
//                 "Cannot Delete Page",
//                 "You must have at least one page.",
//                 [{ text: "OK" }]
//             );
//             return;
//         }

//         Alert.alert(
//             "Delete Page",
//             "Are you sure you want to delete this page?",
//             [
//                 {
//                     text: "Cancel",
//                     style: "cancel"
//                 },
//                 {
//                     text: "Delete",
//                     onPress: async () => {
//                         const newEntries = { ...entries };
//                         const pageId = newEntries[currentPage]?.id;

//                         if (pageId) {
//                             try {
//                                 // In a real app, you might want to implement soft delete
//                                 // await deleteJournalPage(pageId);
//                             } catch (error) {
//                                 console.error('Failed to delete page:', error);
//                             }
//                         }

//                         delete newEntries[currentPage];

//                         let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
//                         const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;

//                         setEntries(newEntries);
//                         setCurrentPage(newCurrentPage);
//                         setTotalPages(newTotalPages);

//                         // Save changes
//                         await AsyncStorage.setItem('journalDrafts', JSON.stringify({
//                             entries: newEntries,
//                             currentPage: newCurrentPage,
//                             totalPages: newTotalPages
//                         }));
//                     },
//                     style: "destructive"
//                 }
//             ]
//         );
//     };

//     const toggleCalendarModal = () => {
//         setShowCalendarModal(!showCalendarModal);
//     };

//     const handleDayPress = (day: { dateString: string }) => {
//         const pagesForDate = pagesByDate[day.dateString];
//         if (pagesForDate && pagesForDate.length > 0) {
//             goToPage(pagesForDate[0].pageNumber);
//         }
//         setShowCalendarModal(false);
//     };

//     const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

//     const getPageTimestamp = () => {
//         const pageData = entries[currentPage] || { title: '', content: '' };
//         if (!pageData.createdAt) {
//             return formatTimestamp(new Date());
//         }
//         return formatTimestamp(new Date(pageData.createdAt));
//     };

//     const { date, time } = getPageTimestamp();

//     const toggleEditing = () => {
//         if (isEditing) {
//             Keyboard.dismiss();
//         }
//         setIsEditing(!isEditing);
//     };

//     const toggleEditingManually = () => {
//         setIsEditing(!isEditing);
//         if (isEditing) {
//             Keyboard.dismiss();
//         }
//     };

//     const toggleTitleEditing = () => {
//         setIsEditingTitle(!isEditingTitle);
//         if (!isEditingTitle && titleInputRef.current) {
//             titleInputRef.current.focus();
//         }
//     };

//     const renderPageItem = ({ item }: { item: { pageNumber: number, title: string } }) => (
//         <TouchableOpacity
//             style={styles.pageItem}
//             onPress={() => {
//                 goToPage(item.pageNumber);
//                 setShowCalendarModal(false);
//             }}
//         >
//             <Text style={styles.pageItemText}>{item.title}</Text>
//             <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
//         </TouchableOpacity>
//     );

//     if (loading) {
//         return (
//             <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     return (
//         <TouchableWithoutFeedback onPress={toggleEditing}>
//             <View style={styles.container}>
//                 {/* Icons at the very top */}
//                 <View style={styles.topIconsContainer}>
//                     <TouchableOpacity
//                         style={styles.editButton}
//                         onPress={toggleEditingManually}
//                     >
//                         {isEditing ? (
//                             <Icon name="book-open-page-variant" size={28} color="#555" />
//                         ) : (
//                             <Icon name="pencil" size={28} color="#555" />
//                         )}
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.bookmarkButton}
//                         onPress={toggleBookmark}
//                     >
//                         <Icon
//                             name={entries[currentPage]?.bookmarked ? "bookmark" : "bookmark-outline"}
//                             size={24}
//                             color={entries[currentPage]?.bookmarked ? "#FFD700" : "#555"}
//                         />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.deleteButton}
//                         onPress={deleteCurrentPage}
//                         disabled={totalPages === 1}
//                     >
//                         <Icon
//                             name="delete"
//                             size={24}
//                             color={totalPages === 1 ? '#ccc' : '#555'}
//                         />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={styles.calendarButton}
//                         onPress={toggleCalendarModal}
//                     >
//                         <Icon
//                             name="calendar-month"
//                             size={24}
//                             color="#555"
//                         />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Title and Date bar */}
//                 <View style={styles.topBar}>
//                     <View style={styles.titleContainer}>
//                         {isEditingTitle ? (
//                             <TextInput
//                                 ref={titleInputRef}
//                                 style={styles.titleInput}
//                                 value={entries[currentPage]?.title || ''}
//                                 onChangeText={handleTitleChange}
//                                 placeholder="Title"
//                                 placeholderTextColor="#d3d3d3"
//                                 onBlur={() => setIsEditingTitle(false)}
//                                 autoFocus
//                             />
//                         ) : (
//                             <TouchableOpacity onPress={toggleTitleEditing}>
//                                 <Text
//                                     style={[
//                                         styles.titleText,
//                                         !entries[currentPage]?.title && styles.placeholderTitle
//                                     ]}
//                                     numberOfLines={1}
//                                 >
//                                     {entries[currentPage]?.title || 'Title'}
//                                 </Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>

//                     <View style={styles.dateContainer}>
//                         <Text style={styles.dateText}>{date}</Text>
//                         <Text style={styles.timestampText}>{time}</Text>
//                     </View>
//                 </View>

//                 {/* Main Content Area */}
//                 <View style={styles.content}>
//                     {isEditing ? (
//                         <TextInput
//                             style={styles.textInput}
//                             multiline
//                             autoFocus={!isEditingTitle}
//                             value={entries[currentPage]?.content || ''}
//                             onChangeText={handleChangeText}
//                             placeholder="Write your thoughts..."
//                             placeholderTextColor="#aaa"
//                             textAlignVertical="top"
//                             scrollEnabled={true}
//                         />
//                     ) : (
//                         <ScrollView
//                             ref={scrollViewRef}
//                             scrollEventThrottle={16}
//                         >
//                             <Text style={styles.text} onPress={() => setIsEditing(true)}>
//                                 {entries[currentPage]?.content?.length > 0
//                                     ? entries[currentPage].content
//                                     : 'Tap anywhere to start writing...'}
//                             </Text>
//                         </ScrollView>
//                     )}
//                 </View>

//                 {/* Navigation and Page Count at bottom */}
//                 <View style={styles.bottomBar}>
//                     <View style={styles.navAndPageContainer}>
//                         <View style={styles.navArrowsContainer}>
//                             <TouchableOpacity
//                                 style={styles.navButton}
//                                 onPress={goToPreviousPage}
//                                 disabled={currentPage === 1}
//                             >
//                                 <Icon
//                                     name="chevron-left"
//                                     size={28}
//                                     color={currentPage === 1 ? '#ccc' : '#555'}
//                                 />
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={styles.navButton}
//                                 onPress={goToNextPage}
//                                 disabled={
//                                     (currentPage === totalPages && !currentPageHasContent) ||
//                                     currentPage === MAX_PAGES
//                                 }
//                             >
//                                 <Icon
//                                     name="chevron-right"
//                                     size={28}
//                                     color={
//                                         (currentPage === totalPages && !currentPageHasContent) ||
//                                             currentPage === MAX_PAGES ? '#ccc' : '#555'
//                                     }
//                                 />
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.pageCountContainer}>
//                             <Text style={styles.pageCountText}>
//                                 Page {currentPage} of {totalPages}
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Calendar Modal */}
//                 <Modal
//                     visible={showCalendarModal}
//                     transparent={true}
//                     animationType="slide"
//                     onRequestClose={toggleCalendarModal}
//                 >
//                     <View style={styles.modalOverlay}>
//                         <View style={styles.calendarModal}>
//                             <View style={styles.calendarHeader}>
//                                 <Text style={styles.calendarTitle}>Journal Entries</Text>
//                                 <TouchableOpacity onPress={toggleCalendarModal}>
//                                     <Icon name="close" size={24} color="#555" />
//                                 </TouchableOpacity>
//                             </View>

//                             <Calendar
//                                 markedDates={markedDates}
//                                 onDayPress={handleDayPress}
//                                 theme={{
//                                     calendarBackground: '#fff',
//                                     selectedDayBackgroundColor: '#FFD700',
//                                     todayTextColor: '#FFD700',
//                                     dayTextColor: '#333',
//                                     textDisabledColor: '#ccc',
//                                     arrowColor: '#555',
//                                     monthTextColor: '#555',
//                                     textDayFontWeight: '400',
//                                     textMonthFontWeight: 'bold',
//                                     textDayHeaderFontWeight: 'bold',
//                                 }}
//                             />

//                             <View style={styles.pagesList}>
//                                 <Text style={styles.pagesListTitle}>Pages by Date</Text>
//                                 <FlatList
//                                     data={Object.entries(pagesByDate)
//                                         .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
//                                         .flatMap(([date, pages]) =>
//                                             pages.map(page => ({
//                                                 ...page,
//                                                 date
//                                             }))
//                                         )}
//                                     keyExtractor={(item) => `${item.date}-${item.pageNumber}`}
//                                     renderItem={({ item }) => (
//                                         <TouchableOpacity
//                                             style={[
//                                                 styles.pageItem,
//                                                 item.pageNumber === currentPage && styles.currentPageItem
//                                             ]}
//                                             onPress={() => {
//                                                 goToPage(item.pageNumber);
//                                                 setShowCalendarModal(false);
//                                             }}
//                                         >
//                                             <Text style={styles.pageItemDate}>
//                                                 {new Date(item.date).toLocaleDateString(undefined, {
//                                                     weekday: 'short',
//                                                     month: 'short',
//                                                     day: 'numeric'
//                                                 })}
//                                             </Text>
//                                             <Text style={styles.pageItemText}>{item.title}</Text>
//                                             <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 />
//                             </View>
//                         </View>
//                     </View>
//                 </Modal>
//             </View>
//         </TouchableWithoutFeedback>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 20,
//         paddingTop: 0,
//     },
//     topIconsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'flex-start',
//         marginBottom: 10,
//     },
//     topBar: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     titleContainer: {
//         flex: 1,
//         marginRight: 10,
//     },
//     dateContainer: {
//         alignItems: 'flex-end',
//     },
//     content: {
//         flex: 1,
//         marginBottom: 10,
//     },
//     bottomBar: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         alignItems: 'flex-end',
//         marginTop: 10,
//     },
//     navAndPageContainer: {
//         alignItems: 'flex-end',
//     },
//     navArrowsContainer: {
//         flexDirection: 'row',
//         marginBottom: 5,
//     },
//     navButton: {
//         padding: 5,
//         marginHorizontal: 5,
//     },
//     editButton: {
//         padding: 5,
//         marginRight: 15,
//     },
//     bookmarkButton: {
//         padding: 5,
//         marginRight: 15,
//     },
//     deleteButton: {
//         padding: 5,
//         marginRight: 15,
//     },
//     calendarButton: {
//         padding: 5,
//     },
//     dateText: {
//         fontSize: 14,
//         color: '#999',
//     },
//     timestampText: {
//         fontSize: 12,
//         color: '#aaa',
//         marginTop: 2,
//     },
//     titleInput: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//         paddingVertical: 5,
//     },
//     titleText: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//         paddingVertical: 5,
//     },
//     placeholderTitle: {
//         color: '#d3d3d3',
//     },
//     text: {
//         fontSize: 18,
//         color: '#000',
//         lineHeight: 28,
//     },
//     textInput: {
//         fontSize: 18,
//         color: '#000',
//         lineHeight: 28,
//         flex: 1,
//     },
//     pageCountContainer: {
//         alignItems: 'flex-end',
//     },
//     pageCountText: {
//         fontSize: 12,
//         color: '#aaa',
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     calendarModal: {
//         backgroundColor: '#fff',
//         flex: 1,
//         marginTop: 50,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 20,
//     },
//     calendarHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     calendarTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#555',
//     },
//     pagesList: {
//         flex: 1,
//         marginTop: 20,
//     },
//     pagesListTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#555',
//     },
//     pageItem: {
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     currentPageItem: {
//         backgroundColor: '#FFF9C4',
//     },
//     pageItemDate: {
//         fontSize: 14,
//         color: '#888',
//         marginBottom: 5,
//     },
//     pageItemText: {
//         fontSize: 16,
//         color: '#333',
//         fontWeight: 'bold',
//     },
//     pageItemNumber: {
//         fontSize: 14,
//         color: '#aaa',
//         marginTop: 5,
//     },
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
  Alert,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { createJournalPage, updateJournalPage, getUserJournalPages } from '@/lib/appwrite/journals';
import { useGlobalContext } from '@/context/GlobalProvider';

const MAX_PAGES = 10;

interface PageData {
  id?: string;
  title: string;
  content: string;
  $createdAt?: string;
  isBookmarked?: boolean;
  pageNumber: number;
}

interface MarkedDate {
  selected: boolean;
  marked?: boolean;
  selectedColor?: string;
}

const Home = () => {
  const [entries, setEntries] = useState<Record<number, PageData>>({1: { title: '', content: '', pageNumber: 1 }});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [pagesByDate, setPagesByDate] = useState<Record<string, {pageNumber: number, title: string}[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const titleInputRef = useRef<TextInput>(null);
  const { user } = useGlobalContext();
  const userId = user ? user.$id : null;

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

  useEffect(() => {
    const dates: Record<string, MarkedDate> = {};
    const byDate: Record<string, {pageNumber: number, title: string}[]> = {};

    Object.entries(entries).forEach(([pageNumber, pageData]) => {
      if (!pageData.$createdAt) return;
      
      const date = new Date(pageData.$createdAt);
      const dateString = date.toISOString().split('T')[0];
      
      dates[dateString] = {
        selected: false,
        marked: true,
      };

      if (!byDate[dateString]) {
        byDate[dateString] = [];
      }
      byDate[dateString].push({
        pageNumber: pageData.pageNumber,
        title: pageData.title || 'Untitled'
      });
    });

    setMarkedDates(dates);
    setPagesByDate(byDate);
  }, [entries]);

  const loadJournalPages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let pages = [];
      
      if (userId) {
        try {
          pages = await getUserJournalPages(userId);
        } catch (dbError) {
          console.warn('Failed to load from database:', dbError);
        }
      }
      
      if (pages.length === 0) {
        const storedDrafts = await AsyncStorage.getItem('journalDrafts');
        if (storedDrafts !== null) {
          const parsedDrafts = JSON.parse(storedDrafts);
          setEntries(parsedDrafts.entries || {1: { title: '', content: '', pageNumber: 1 }});
          setCurrentPage(parsedDrafts.currentPage || 1);
          setTotalPages(parsedDrafts.totalPages || 1);
          return;
        }
      }
      
      if (pages.length > 0) {
        const newEntries: Record<number, PageData> = {};
        pages.forEach((page) => {
          newEntries[page.pageNumber] = {
            id: page.$id,
            title: page.pageTitle,
            content: page.pageContent,
            $createdAt: page.$createdAt,
            isBookmarked: page.isBookmarked,
            pageNumber: page.pageNumber
          };
        });
        
        setEntries(newEntries);
        const maxPageNumber = Math.max(...pages.map(p => p.pageNumber), 1);
        setTotalPages(maxPageNumber);
        
        if (maxPageNumber < MAX_PAGES && !newEntries[maxPageNumber + 1]) {
          newEntries[maxPageNumber + 1] = { 
            title: '', 
            content: '', 
            pageNumber: maxPageNumber + 1 
          };
          setEntries(newEntries);
        }
      } else {
        setEntries({1: { title: '', content: '', pageNumber: 1 }});
      }
    } catch (error) {
      console.error('Failed to load journal pages:', error);
      setError('Failed to load journal entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournalPages();
  }, [userId]);

  const saveToDatabase = useCallback(
    debounce(async (pageNumber: number, pageData: PageData) => {
      try {
        if (!userId) {
          await AsyncStorage.setItem('journalDrafts', JSON.stringify({
            entries,
            currentPage,
            totalPages
          }));
          return;
        }
        
        const { id, title, content, isBookmarked } = pageData;
        
        if (content.trim().length > 0) {
          if (!id && !entries[pageNumber]?.$createdAt) {
            const newPage = await createJournalPage(
              userId,
              title,
              content,
              isBookmarked || false,
              pageNumber
            );
            
            setEntries(prev => ({
              ...prev,
              [pageNumber]: {
                ...prev[pageNumber],
                id: newPage.$id,
                $createdAt: newPage.$createdAt,
                pageNumber: newPage.pageNumber
              }
            }));
          } else if (id) {
            await updateJournalPage(id, {
              pageTitle: title,
              pageContent: content,
              isBookmarked: isBookmarked,
              pageNumber
            });
          }
        }
      } catch (error) {
        console.error('Failed to save to database:', error);
        await AsyncStorage.setItem('journalDrafts', JSON.stringify({
          entries,
          currentPage,
          totalPages
        }));
      }
    }, 1500),
    [userId, entries, currentPage, totalPages]
  );

  const toggleBookmark = async () => {
    const updatedEntries = {
      ...entries,
      [currentPage]: {
        ...entries[currentPage],
        isBookmarked: !entries[currentPage]?.isBookmarked
      }
    };
    setEntries(updatedEntries);
    
    if (entries[currentPage]?.id) {
      await updateJournalPage(entries[currentPage].id!, {
        isBookmarked: !entries[currentPage]?.isBookmarked,
        pageNumber: currentPage
      });
    } else {
      saveToDatabase(currentPage, updatedEntries[currentPage]);
    }
  };

  const handleChangeText = (text: string) => {
    const now = new Date();
    const updatedEntries = {...entries};
    
    if (!updatedEntries[currentPage]) {
      updatedEntries[currentPage] = { title: '', content: '', pageNumber: currentPage };
    }
    
    if (!updatedEntries[currentPage].$createdAt && text.trim().length > 0) {
      updatedEntries[currentPage] = {
        ...updatedEntries[currentPage],
        content: text,
        $createdAt: now.toISOString(),
        pageNumber: currentPage
      };
    } else {
      updatedEntries[currentPage] = {
        ...updatedEntries[currentPage],
        content: text,
        pageNumber: currentPage
      };
    }
    
    setEntries(updatedEntries);
    saveToDatabase(currentPage, updatedEntries[currentPage]);
  };

  const handleTitleChange = (text: string) => {
    const updatedEntries = {...entries};
    
    if (!updatedEntries[currentPage]) {
      updatedEntries[currentPage] = { title: '', content: '', pageNumber: currentPage };
    }
    
    updatedEntries[currentPage] = {
      ...updatedEntries[currentPage],
      title: text,
      pageNumber: currentPage
    };
    
    setEntries(updatedEntries);
    saveToDatabase(currentPage, updatedEntries[currentPage]);
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
      const newPage = currentPage + 1;
      setEntries({
        ...entries, 
        [newPage]: { 
          title: '', 
          content: '', 
          pageNumber: newPage 
        }
      });
      setTotalPages(newPage);
      goToPage(newPage);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setIsEditingTitle(false);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, animated: false});
    }
  };

  const deleteCurrentPage = async () => {
    if (totalPages === 1) {
      Alert.alert(
        "Cannot Delete Page",
        "You must have at least one page.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Delete Page",
      "Are you sure you want to delete this page?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            const newEntries = {...entries};
            const pageId = newEntries[currentPage]?.id;
            
            if (pageId) {
              try {
                // Soft delete would go here if implemented
              } catch (error) {
                console.error('Failed to delete page:', error);
              }
            }
            
            delete newEntries[currentPage];
            
            let newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
            const newTotalPages = currentPage === totalPages ? totalPages - 1 : totalPages;
            
            setEntries(newEntries);
            setCurrentPage(newCurrentPage);
            setTotalPages(newTotalPages);
            
            await AsyncStorage.setItem('journalDrafts', JSON.stringify({
              entries: newEntries,
              currentPage: newCurrentPage,
              totalPages: newTotalPages
            }));
          },
          style: "destructive"
        }
      ]
    );
  };

  const toggleCalendarModal = () => {
    setShowCalendarModal(!showCalendarModal);
  };

  const handleDayPress = (day: {dateString: string}) => {
    const pagesForDate = pagesByDate[day.dateString];
    if (pagesForDate && pagesForDate.length > 0) {
      goToPage(pagesForDate[0].pageNumber);
    }
    setShowCalendarModal(false);
  };

  const currentPageHasContent = (entries[currentPage]?.content || '').trim().length > 0;

  const getPageTimestamp = () => {
    const pageData = entries[currentPage] || { title: '', content: '', pageNumber: currentPage };
    if (!pageData.$createdAt) {
      return formatTimestamp(new Date());
    }
    return formatTimestamp(new Date(pageData.$createdAt));
  };

  const { date, time } = getPageTimestamp();

  const toggleEditing = () => {
    if (isEditing) {
      Keyboard.dismiss();
    }
    setIsEditing(!isEditing);
  };

  const toggleEditingManually = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      Keyboard.dismiss();
    }
  };

  const toggleTitleEditing = () => {
    setIsEditingTitle(!isEditingTitle);
    if (!isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const renderPageItem = ({item}: {item: {pageNumber: number, title: string}}) => (
    <TouchableOpacity 
      style={styles.pageItem} 
      onPress={() => {
        goToPage(item.pageNumber);
        setShowCalendarModal(false);
      }}
    >
      <Text style={styles.pageItemText}>{item.title}</Text>
      <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadJournalPages}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={toggleEditing}>
      <View style={styles.container}>
        {/* Icons at the very top */}
        <View style={styles.topIconsContainer}>
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
            style={styles.bookmarkButton} 
            onPress={toggleBookmark}
          >
            <Icon 
              name={entries[currentPage]?.isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={entries[currentPage]?.isBookmarked ? "#FFD700" : "#555"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={deleteCurrentPage}
            disabled={totalPages === 1}
          >
            <Icon 
              name="delete" 
              size={24} 
              color={totalPages === 1 ? '#ccc' : '#555'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.calendarButton} 
            onPress={toggleCalendarModal}
          >
            <Icon 
              name="calendar-month" 
              size={24} 
              color="#555" 
            />
          </TouchableOpacity>
        </View>

        {/* Title and Date bar */}
        <View style={styles.topBar}>
          <View style={styles.titleContainer}>
            {isEditingTitle ? (
              <TextInput
                ref={titleInputRef}
                style={styles.titleInput}
                value={entries[currentPage]?.title || ''}
                onChangeText={handleTitleChange}
                placeholder="Title"
                placeholderTextColor="#d3d3d3"
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={toggleTitleEditing}>
                <Text 
                  style={[
                    styles.titleText,
                    !entries[currentPage]?.title && styles.placeholderTitle
                  ]} 
                  numberOfLines={1}
                >
                  {entries[currentPage]?.title || 'Title'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.timestampText}>{time}</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.content}>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              multiline
              autoFocus={!isEditingTitle}
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

        {/* Navigation and Page Count at bottom */}
        <View style={styles.bottomBar}>
          <View style={styles.navAndPageContainer}>
            <View style={styles.navArrowsContainer}>
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
            
            <View style={styles.pageCountContainer}>
              <Text style={styles.pageCountText}>
                Page {currentPage} of {totalPages}
              </Text>
            </View>
          </View>
        </View>

        {/* Calendar Modal */}
        <Modal
          visible={showCalendarModal}
          transparent={true}
          animationType="slide"
          onRequestClose={toggleCalendarModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.calendarModal}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Journal Entries</Text>
                <TouchableOpacity onPress={toggleCalendarModal}>
                  <Icon name="close" size={24} color="#555" />
                </TouchableOpacity>
              </View>
              
              <Calendar
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={{
                  calendarBackground: '#fff',
                  selectedDayBackgroundColor: '#FFD700',
                  todayTextColor: '#FFD700',
                  dayTextColor: '#333',
                  textDisabledColor: '#ccc',
                  arrowColor: '#555',
                  monthTextColor: '#555',
                  textDayFontWeight: '400',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: 'bold',
                }}
              />
              
              <View style={styles.pagesList}>
                <Text style={styles.pagesListTitle}>Pages by Date</Text>
                <FlatList
                  data={Object.entries(pagesByDate)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .flatMap(([date, pages]) => 
                      pages.map(page => ({
                        ...page,
                        date
                      }))
                    )}
                  keyExtractor={(item) => `${item.date}-${item.pageNumber}`}
                  renderItem={({item}) => (
                    <TouchableOpacity 
                      style={[
                        styles.pageItem,
                        item.pageNumber === currentPage && styles.currentPageItem
                      ]} 
                      onPress={() => {
                        goToPage(item.pageNumber);
                        setShowCalendarModal(false);
                      }}
                    >
                      <Text style={styles.pageItemDate}>
                        {new Date(item.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                      <Text style={styles.pageItemText}>{item.title}</Text>
                      <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 0,
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    marginBottom: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  navAndPageContainer: {
    alignItems: 'flex-end',
  },
  navArrowsContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  navButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  editButton: {
    padding: 5,
    marginRight: 15,
  },
  bookmarkButton: {
    padding: 5,
    marginRight: 15,
  },
  deleteButton: {
    padding: 5,
    marginRight: 15,
  },
  calendarButton: {
    padding: 5,
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
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 5,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 5,
  },
  placeholderTitle: {
    color: '#d3d3d3',
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
    alignItems: 'flex-end',
  },
  pageCountText: {
    fontSize: 12,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarModal: {
    backgroundColor: '#fff',
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  pagesList: {
    flex: 1,
    marginTop: 20,
  },
  pagesListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  pageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentPageItem: {
    backgroundColor: '#FFF9C4',
  },
  pageItemDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  pageItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  pageItemNumber: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#555',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Home;