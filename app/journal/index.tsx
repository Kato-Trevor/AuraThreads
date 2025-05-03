import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import debounce from "lodash.debounce";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from "react-native-calendars";
import {
  createJournalPage,
  deleteJournalPage,
  updateJournalPage,
  getUserJournalPages,
} from "@/lib/appwrite/journal";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
  const [entries, setEntries] = useState<Record<number, PageData>>({
    1: { title: "", content: "", pageNumber: 1 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>(
    {}
  );
  const [pagesByDate, setPagesByDate] = useState<
    Record<string, { pageNumber: number; title: string }[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const titleInputRef = useRef<TextInput>(null);
  const { user } = useGlobalContext();
  const userId = user ? user.$id : null;
  const isSaving = useRef(false);

  const formatTimestamp = (date: Date) => {
    return {
      date: date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  useEffect(() => {
    const dates: Record<string, MarkedDate> = {};
    const byDate: Record<string, { pageNumber: number; title: string }[]> = {};

    Object.entries(entries).forEach(([pageNumber, pageData]) => {
      if (!pageData.$createdAt) return;

      const date = new Date(pageData.$createdAt);
      const dateString = date.toISOString().split("T")[0];

      dates[dateString] = {
        selected: false,
        marked: true,
        selectedColor: "#588b76",
      };

      if (!byDate[dateString]) {
        byDate[dateString] = [];
      }
      byDate[dateString].push({
        pageNumber: parseInt(pageNumber),
        title: pageData.title || "Untitled",
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
          console.warn("Failed to load from database:", dbError);
        }
      }

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
            pageNumber: page.pageNumber,
          };
        });

        // Ensure pages are sequentially numbered
        const sortedPages = Object.values(newEntries)
          .sort((a, b) => a.pageNumber - b.pageNumber)
          .map((page, index) => ({
            ...page,
            pageNumber: index + 1,
          }));

        const finalEntries: Record<number, PageData> = {};
        sortedPages.forEach((page) => {
          finalEntries[page.pageNumber] = page;
        });

        setEntries(finalEntries);
        const maxPageNumber =
          sortedPages.length > 0
            ? Math.max(...sortedPages.map((p) => p.pageNumber))
            : 1;
        setTotalPages(maxPageNumber);

        // Determine the page with the latest update
        const latestPage = sortedPages.reduce((latest, page) => {
          // Safely convert the updated timestamps, falling back to createdAt or epoch start if undefined
          const latestDate = new Date(
            latest.$updatedAt ?? latest.$createdAt ?? 0
          );
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
            sortedPages.map((page) => {
              if (page.id) {
                return updateJournalPage(page.id, {
                  pageNumber: page.pageNumber,
                });
              }
              return Promise.resolve();
            })
          );
        }
      } else {
        // Initialize with empty first page
        setEntries({ 1: { title: "", content: "", pageNumber: 1 } });
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to load journal pages:", error);
      setError("Failed to load journal entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournalPages();
  }, [userId]);

  const saveToDatabase = useCallback(
    debounce(async (pageNumber: number, pageData: PageData) => {
      if (isSaving.current) return;
      isSaving.current = true;

      try {
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

            setEntries((prev) => ({
              ...prev,
              [pageNumber]: {
                ...prev[pageNumber],
                id: newPage.$id,
                $createdAt: newPage.$createdAt,
                pageNumber: newPage.pageNumber,
              },
            }));
          } else if (id) {
            await updateJournalPage(id, {
              pageTitle: title,
              pageContent: content,
              isBookmarked: isBookmarked,
              pageNumber,
            });
          }
        }
      } catch (error) {
        console.error("Failed to save to database:", error);
      } finally {
        isSaving.current = false;
      }
    }, 1500),
    [userId, entries, currentPage, totalPages]
  );

  const toggleBookmark = async () => {
    const updatedEntries = {
      ...entries,
      [currentPage]: {
        ...entries[currentPage],
        isBookmarked: !entries[currentPage]?.isBookmarked,
      },
    };
    setEntries(updatedEntries);

    if (entries[currentPage]?.id) {
      await updateJournalPage(entries[currentPage].id!, {
        isBookmarked: !entries[currentPage]?.isBookmarked,
        pageNumber: currentPage,
      });
    } else {
      saveToDatabase(currentPage, updatedEntries[currentPage]);
    }
  };

  const handleChangeText = (text: string) => {
    const now = new Date();
    const updatedEntries = { ...entries };

    if (!updatedEntries[currentPage]) {
      updatedEntries[currentPage] = {
        title: "",
        content: "",
        pageNumber: currentPage,
      };
    }

    if (!updatedEntries[currentPage].$createdAt && text.trim().length > 0) {
      updatedEntries[currentPage] = {
        ...updatedEntries[currentPage],
        content: text,
        $createdAt: now.toISOString(),
        pageNumber: currentPage,
      };
    } else {
      updatedEntries[currentPage] = {
        ...updatedEntries[currentPage],
        content: text,
        pageNumber: currentPage,
      };
    }

    setEntries(updatedEntries);
    saveToDatabase(currentPage, updatedEntries[currentPage]);
  };

  const handleTitleChange = (text: string) => {
    const updatedEntries = { ...entries };

    if (!updatedEntries[currentPage]) {
      updatedEntries[currentPage] = {
        title: "",
        content: "",
        pageNumber: currentPage,
      };
    }

    updatedEntries[currentPage] = {
      ...updatedEntries[currentPage],
      title: text,
      pageNumber: currentPage,
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
    const currentContent = entries[currentPage]?.content || "";

    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    } else if (totalPages < MAX_PAGES && currentContent.trim().length > 0) {
      // Create new page with correct numbering
      const newPageNumber = totalPages + 1;
      setEntries((prev) => ({
        ...prev,
        [newPageNumber]: {
          title: "",
          content: "",
          pageNumber: newPageNumber,
        },
      }));
      setTotalPages(newPageNumber);
      goToPage(newPageNumber);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setIsEditingTitle(false);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  };

  const deleteCurrentPage = async () => {
    if (totalPages === 1) {
      Alert.alert("Cannot Delete Page", "You must have at least one page.", [
        { text: "OK" },
      ]);
      return;
    }

    Alert.alert("Delete Page", "Are you sure you want to delete this page?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const newEntries = { ...entries };
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
                pageNumber: index + 1,
              }));

            // Create new entries object with renumbered pages
            const renumberedEntries: Record<number, PageData> = {};
            remainingPages.forEach((page) => {
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
                remainingPages.map((page) => {
                  if (page.id) {
                    return updateJournalPage(page.id, {
                      pageNumber: page.pageNumber,
                    });
                  }
                  return Promise.resolve();
                })
              );
            }
          } catch (error) {
            console.error("Failed to delete page:", error);
            Alert.alert("Error", "Failed to delete page. Please try again.", [
              { text: "OK" },
            ]);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const toggleCalendarModal = () => {
    setShowCalendarModal(!showCalendarModal);
  };

  const handleDayPress = (day: { dateString: string }) => {
    const pagesForDate = pagesByDate[day.dateString];
    if (pagesForDate && pagesForDate.length > 0) {
      goToPage(pagesForDate[0].pageNumber);
    }
    setShowCalendarModal(false);
  };

  const currentPageHasContent =
    (entries[currentPage]?.content || "").trim().length > 0;

  const getPageTimestamp = () => {
    const pageData = entries[currentPage] || {
      title: "",
      content: "",
      pageNumber: currentPage,
    };
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

  const renderPageItem = ({
    item,
  }: {
    item: { pageNumber: number; title: string };
  }) => (
    <TouchableOpacity
      style={styles.pageItem}
      onPress={() => {
        goToPage(item.pageNumber);
        setShowCalendarModal(false);
      }}
    >
      <Text style={styles.pageItemText}>{item.title || "Untitled"}</Text>
      <Text style={styles.pageItemNumber}>Page {item.pageNumber}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={[styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#588b76" />
          <Text style={styles.loadingText}>Loading your journal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={[styles.errorContainer]}>
          <Icon name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadJournalPages}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TouchableWithoutFeedback onPress={toggleEditing}>
        <View style={styles.container}>
          {/* Top action bar with gradient */}
          <LinearGradient
            colors={["#F5F5F5", "#FFFFFF"]}
            style={styles.topGradient}
          >
            <View style={styles.topIconsContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  router.back();
                }}
                className="mr-2"
              >
                <Ionicons name="chevron-back-sharp" size={24} color="#588b76" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleEditingManually}
              >
                {isEditing ? (
                  <Ionicons name="book-outline" size={24} color="#588b76" />
                ) : (
                  <Icon name="pencil" size={24} color="#588b76" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleBookmark}
              >
                <Icon
                  name={
                    entries[currentPage]?.isBookmarked
                      ? "bookmark"
                      : "bookmark-outline"
                  }
                  size={24}
                  color={
                    entries[currentPage]?.isBookmarked ? "#588b76" : "#588b76"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={deleteCurrentPage}
                disabled={totalPages === 1}
              >
                <Icon
                  name="delete-outline"
                  size={24}
                  color={totalPages === 1 ? "#ccc" : "#588b76"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleCalendarModal}
              >
                <Icon name="calendar-month-outline" size={24} color="#588b76" />
              </TouchableOpacity>
            </View>

            {/* Title and Date bar */}
            <View style={styles.topBar}>
              <View style={styles.titleContainer}>
                {isEditingTitle ? (
                  <TextInput
                    ref={titleInputRef}
                    style={styles.titleInput}
                    value={entries[currentPage]?.title || ""}
                    onChangeText={handleTitleChange}
                    placeholder="Title"
                    placeholderTextColor="#B8B8B8"
                    onBlur={() => setIsEditingTitle(false)}
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity
                    onPress={toggleTitleEditing}
                    style={styles.titleTouchable}
                  >
                    <Text
                      style={[
                        styles.titleText,
                        !entries[currentPage]?.title && styles.placeholderTitle,
                      ]}
                      numberOfLines={1}
                    >
                      {entries[currentPage]?.title || "Title"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.timestampText}>{time}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Main Content Area */}
          <View style={styles.content}>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                multiline
                autoFocus={!isEditingTitle}
                value={entries[currentPage]?.content || ""}
                onChangeText={handleChangeText}
                placeholder="Write your thoughts..."
                placeholderTextColor="#B8B8B8"
                textAlignVertical="top"
                scrollEnabled={true}
              />
            ) : (
              <ScrollView
                ref={scrollViewRef}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
              >
                <Text
                  style={[
                    styles.text,
                    !entries[currentPage]?.content && styles.placeholderContent,
                  ]}
                  onPress={() => setIsEditing(true)}
                >
                  {entries[currentPage]?.content?.length > 0
                    ? entries[currentPage].content
                    : "Tap anywhere to start writing..."}
                </Text>
              </ScrollView>
            )}
          </View>

          {/* Navigation and Page Count at bottom */}
          <LinearGradient
            colors={["#FFFFFF", "#F5F5F5"]}
            style={styles.bottomGradient}
          >
            <View style={styles.navAndPageContainer}>
              <View style={styles.navArrowsContainer}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPage === 1 && styles.navButtonDisabled,
                  ]}
                  onPress={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <Icon
                    name="chevron-left"
                    size={28}
                    color={currentPage === 1 ? "#ccc" : "#588b76"}
                  />
                </TouchableOpacity>

                <View style={styles.pageCountContainer}>
                  <Text style={styles.pageCountText}>
                    Page {currentPage} of {totalPages}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.navButton,
                    ((currentPage === totalPages && !currentPageHasContent) ||
                      currentPage === MAX_PAGES) &&
                      styles.navButtonDisabled,
                  ]}
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
                      currentPage === MAX_PAGES
                        ? "#ccc"
                        : "#588b76"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Calendar Modal */}
          <Modal
            visible={showCalendarModal}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleCalendarModal}
          >
            <SafeAreaView style={styles.modalOverlay}>
              <View style={styles.calendarModal}>
                <LinearGradient
                  colors={["#588b76", "#85aa9b"]}
                  style={styles.calendarHeader}
                >
                  <Text style={styles.calendarTitle}>Journal Entries</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={toggleCalendarModal}
                  >
                    <Icon name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </LinearGradient>

                <Calendar
                  markedDates={markedDates}
                  onDayPress={handleDayPress}
                  theme={{
                    calendarBackground: "#fff",
                    selectedDayBackgroundColor: "#588b76",
                    todayTextColor: "#588b76",
                    dayTextColor: "#333",
                    textDisabledColor: "#ccc",
                    arrowColor: "#588b76",
                    monthTextColor: "#444",
                    textDayFontWeight: "400",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "bold",
                  }}
                />

                <View style={styles.pagesList}>
                  <Text style={styles.pagesListTitle}>
                    Journal Entries by Date
                  </Text>
                  {Object.keys(pagesByDate).length === 0 ? (
                    <View style={styles.emptyList}>
                      <Icon
                        name="book-open-page-variant"
                        size={48}
                        color="#DDD"
                      />
                      <Text style={styles.emptyListText}>No entries yet</Text>
                      <Text style={styles.emptyListSubtext}>
                        Start writing to create your first entry
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={Object.entries(pagesByDate)
                        .sort(
                          ([a], [b]) =>
                            new Date(b).getTime() - new Date(a).getTime()
                        )
                        .flatMap(([date, pages]) =>
                          pages.map((page) => ({
                            ...page,
                            date,
                          }))
                        )}
                      keyExtractor={(item) => `${item.date}-${item.pageNumber}`}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.pageItem,
                            item.pageNumber === currentPage &&
                              styles.currentPageItem,
                          ]}
                          onPress={() => {
                            goToPage(item.pageNumber);
                            setShowCalendarModal(false);
                          }}
                        >
                          <View style={styles.pageItemContent}>
                            <Text style={styles.pageItemDate}>
                              {new Date(item.date).toLocaleDateString(
                                undefined,
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                            <Text style={styles.pageItemText}>
                              {item.title || "Untitled"}
                            </Text>
                          </View>
                          <View style={styles.pageNumberBadge}>
                            <Text style={styles.pageItemNumber}>
                              {item.pageNumber}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#588b76",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  topGradient: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  bottomGradient: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  topIconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  iconButton: {
    padding: 8,
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: "#F0F0F5",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
  },
  titleTouchable: {
    padding: 5,
  },
  dateContainer: {
    alignItems: "flex-end",
    backgroundColor: "#F0F0F5",
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  navAndPageContainer: {
    alignItems: "center",
  },
  navArrowsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  navButton: {
    padding: 10,
    backgroundColor: "#F0F0F5",
    borderRadius: 10,
    width: 50,
    alignItems: "center",
  },
  navButtonDisabled: {
    backgroundColor: "#F5F5F5",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#588b76",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 8,
  },
  placeholderTitle: {
    color: "#B8B8B8",
  },
  text: {
    fontSize: 18,
    color: "#333",
    lineHeight: 28,
  },
  placeholderContent: {
    color: "#B8B8B8",
    fontStyle: "italic",
  },
  textInput: {
    fontSize: 18,
    color: "#333",
    lineHeight: 28,
    flex: 1,
    padding: 15,
    textAlignVertical: "top",
  },
  pageCountContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pageCountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  calendarModal: {
    backgroundColor: "#fff",
    flex: 1,
    marginTop: Platform.OS === "ios" ? 50 : 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  pagesList: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  pagesListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#444",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyListText: {
    fontSize: 18,
    color: "#888",
    marginTop: 15,
    fontWeight: "500",
  },
  emptyListSubtext: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 5,
    textAlign: "center",
  },
  pageItem: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pageItemContent: {
    flex: 1,
  },
  currentPageItem: {
    backgroundColor: "#d0ded8",
    borderLeftWidth: 4,
    borderLeftColor: "#588b76",
  },
  pageItemDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  pageItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  pageNumberBadge: {
    backgroundColor: "#588b76",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  pageItemNumber: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#588b76",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Journal;
