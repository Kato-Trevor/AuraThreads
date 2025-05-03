import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getBookmarkedJournalPages } from '@/lib/appwrite/journal';

export const JournalBookmarks = () => {
    const { user } = useGlobalContext();
    const [bookmarkedPages, setBookmarkedPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedPageId, setExpandedPageId] = useState<string | null>(null);

    const fetchBookmarkedPages = useCallback(async () => {
        try {
            setIsLoading(true);
            if (!user?.$id) return;

            const pages = await getBookmarkedJournalPages(user.$id);
            setBookmarkedPages(pages);
        } catch (error) {
            console.error("Error fetching bookmarked journal pages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.$id]);

    useEffect(() => {
        fetchBookmarkedPages();
    }, [fetchBookmarkedPages]);

    const toggleExpand = (pageId: string) => {
        setExpandedPageId(expandedPageId === pageId ? null : pageId);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#18392b" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {bookmarkedPages.length > 0 ? (
                bookmarkedPages.map((page) => (
                    <TouchableOpacity
                        key={page.$id}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => toggleExpand(page.$id)}
                    >
                        <Text style={styles.pageTitle}>{page.pageTitle}</Text>

                        <Text
                            style={styles.pageContent}
                            numberOfLines={expandedPageId === page.$id ? undefined : 3}
                            ellipsizeMode="tail"
                        >
                            {page.pageContent}
                        </Text>

                        <View style={styles.pageNumberContainer}>
                            <Text style={styles.pageNumber}>Page {page.pageNumber}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No bookmarked journal pages yet</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
        elevation: 1.5,
    },
    pageTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18392b',
        marginBottom: 8,
    },
    pageContent: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    pageNumberContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    pageNumber: {
        fontSize: 12,
        color: '#6c757d',
        fontStyle: 'italic',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
    },
});