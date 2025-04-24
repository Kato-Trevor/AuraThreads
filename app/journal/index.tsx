

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
// import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import { createJournalPage, deleteJournalPage, updateJournalPage, getUserJournalPages } from '@/lib/appwrite/journal';
import { useGlobalContext } from '@/context/GlobalProvider';
import { Ionicons } from "@expo/vector-icons";
import { Stack } from 'expo-router';

const MAX_PAGES = 10;

interface PageData {
  id?: string;
  title: string;
  content: string;
  $createdAt?: string;
  $updatedAt?: string;
  isBookmarked?: boolean;
  pageNumber: number;
}

interface MarkedDate {
  selected: boolean;
  marked?: boolean;
  selectedColor?: string;
}

const Journal = () => {
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
      let localDrafts = null;
      
      // Try to load from database first if user is logged in
      if (userId) {
        try {
          pages = await getUserJournalPages(userId);
        } catch (dbError) {
          console.warn('Failed to load from database:', dbError);
        }
      }
      
      // Check for local drafts if no pages found in database
    //   if (pages.length === 0) {
    //     const storedDrafts = await AsyncStorage.getItem('journalDrafts');
    //     if (storedDrafts !== null) {
    //       localDrafts = JSON.parse(storedDrafts);
    //     }
    //   }
      
      // Process the loaded data
      if (pages.length > 0) {
        // Process database pages - ensure $updatedAt is stored
        const newEntries: Record<number, PageData> = {};
        pages.forEach((page) => {
          newEntries[page.pageNumber] = {
            id: page.$id,
            title: page.pageTitle,
            content: page.pageContent,
            $createdAt: page.$createdAt,
            $updatedAt: page.$updatedAt, // include updated attribute
            isBookmarked: page.isBookmarked,
            pageNumber: page.pageNumber
          };
        });
        
        // Ensure pages are sequentially numbered
        const sortedPages = Object.values(newEntries)
          .sort((a, b) => a.pageNumber - b.pageNumber)
          .map((page, index) => ({
            ...page,
            pageNumber: index + 1
          }));
        
        const finalEntries: Record<number, PageData> = {};
        sortedPages.forEach(page => {
          finalEntries[page.pageNumber] = page;
        });
        
        setEntries(finalEntries);
        const maxPageNumber = sortedPages.length > 0 ? 
          Math.max(...sortedPages.map(p => p.pageNumber)) : 1;
        setTotalPages(maxPageNumber);
        
        // Add empty page if needed
        // if (maxPageNumber < MAX_PAGES && !finalEntries[maxPageNumber + 1]) {
        //   finalEntries[maxPageNumber + 1] = { 
        //     title: '', 
        //     content: '', 
        //     pageNumber: maxPageNumber + 1 
        //   };
        //   setEntries(finalEntries);
        //   setTotalPages(maxPageNumber + 1);
        // }
        
        // Determine the page with the latest update
        const latestPage = sortedPages.reduce((latest, page) => {
          // Safely convert the updated timestamps, falling back to createdAt or epoch start if undefined
          const latestDate = new Date(latest.$updatedAt ?? latest.$createdAt ?? 0);
          const currentDate = new Date(page.$updatedAt ?? page.$createdAt ?? 0);
          return currentDate > latestDate ? page : latest;
        }, sortedPages[0]);
        
        // Set the current page to the most recently updated page
        if (latestPage) {
          setCurrentPage(latestPage.pageNumber);
        } else {
          setCurrentPage(1);
        }
        
        // Update database with renumbered pages if needed
        if (userId && pages.length !== sortedPages.length) {
          await Promise.all(
            sortedPages.map(page => {
              if (page.id) {
                return updateJournalPage(page.id, {
                  pageNumber: page.pageNumber
                });
              }
              return Promise.resolve();
            })
          );
        }
      } 
      // else if (localDrafts) {
      //   // Use local drafts if available
      //   setEntries(localDrafts.entries || {1: { title: '', content: '', pageNumber: 1 }});
      //   setCurrentPage(localDrafts.currentPage || 1);
      //   setTotalPages(localDrafts.totalPages || 1);
      // } 
      else {
        // Initialize with empty first page
        setEntries({1: { title: '', content: '', pageNumber: 1 }});
        setCurrentPage(1);
        setTotalPages(1);
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
        // if (!userId) {
        //   await AsyncStorage.setItem('journalDrafts', JSON.stringify({
        //     entries,
        //     currentPage,
        //     totalPages
        //   }));
        //   return;
        // }
        
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
        // await AsyncStorage.setItem('journalDrafts', JSON.stringify({
        //   entries,
        //   currentPage,
        //   totalPages
        // }));
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
      // Create new page with correct numbering
      const newPageNumber = totalPages + 1;
      setEntries(prev => ({
        ...prev, 
        [newPageNumber]: { 
          title: '', 
          content: '', 
          pageNumber: newPageNumber 
        }
      }));
      setTotalPages(newPageNumber);
      goToPage(newPageNumber);
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
            try {
              const newEntries = {...entries};
              const pageId = newEntries[currentPage]?.id;
              
              // Delete from database if exists
              if (pageId) {
                await deleteJournalPage(pageId);
              }
              
              // Delete the current page
              delete newEntries[currentPage];
              
              // Reorganize remaining pages to maintain sequential numbering
              const remainingPages = Object.values(newEntries)
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((page, index) => ({
                  ...page,
                  pageNumber: index + 1
                }));
              
              // Create new entries object with renumbered pages
              const renumberedEntries: Record<number, PageData> = {};
              remainingPages.forEach(page => {
                renumberedEntries[page.pageNumber] = page;
              });
              
              // Determine the new current page (either previous page or first page)
              const newCurrentPage = currentPage > 1 ? currentPage - 1 : 1;
              const newTotalPages = remainingPages.length;
              
              // Update state
              setEntries(renumberedEntries);
              setCurrentPage(newCurrentPage);
              setTotalPages(newTotalPages);
              
              // Update database with renumbered pages
              if (userId) {
                await Promise.all(
                  remainingPages.map(page => {
                    if (page.id) {
                      return updateJournalPage(page.id, {
                        pageNumber: page.pageNumber
                      });
                    }
                    return Promise.resolve();
                  })
                );
              }
              
              // Update local storage
            //   await AsyncStorage.setItem('journalDrafts', JSON.stringify({
            //     entries: renumberedEntries,
            //     currentPage: newCurrentPage,
            //     totalPages: newTotalPages
            //   }));
              
            } catch (error) {
              console.error('Failed to delete page:', error);
              Alert.alert(
                "Error",
                "Failed to delete page. Please try again.",
                [{ text: "OK" }]
              );
            }
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
    <>
    <Stack.Screen
            name="Journal"
            options={{
              title: 'Journal',
              headerTitleAlign: 'center',
            }}
          />
    <TouchableWithoutFeedback onPress={toggleEditing}>
        
      <View style={styles.container}>
        {/* Icons at the very top */}
        <View style={styles.topIconsContainer}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={toggleEditingManually}
          >
            {isEditing ? (
              <Ionicons name="book-outline" size={28} color="#555" />   // <Icon name="book-open-page-variant" size={28} color="#555" /> 
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
    </>
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

export default Journal;