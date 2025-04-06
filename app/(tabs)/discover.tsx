import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  details?: string;
}

// Dummy data for each fundamental category

const awarenessContent: ContentItem[] = [
  {
    id: '1',
    title: 'Finding Resilience',
    description: 'Curated insights to help you navigate challenges with strength.',
    details: 'Discover strategies that empower you to overcome obstacles and foster personal growth.',
  },
  {
    id: '2',
    title: 'Embracing Change',
    description: 'Insights on adapting positively to life transitions.',
    details: 'Learn how shifts in perspective can transform challenges into opportunities.',
  },
];

const connectionContent: ContentItem[] = [
  {
    id: '1',
    title: 'Guided Reflection',
    description: 'Take a quiet moment for self-reflection with gentle prompts.',
    details: 'Engage in simple exercises that help you process emotions and gain clarity.',
  },
  {
    id: '2',
    title: 'Expressive Journaling',
    description: 'Capture your thoughts in a private, reflective space.',
    details: 'Journaling can help you understand your feelings and track personal progress over time.',
  },
];

const insightContent: ContentItem[] = [
  {
    id: '1',
    title: 'Grounding Exercise',
    description: 'Practice simple techniques to help you feel centered.',
    details: 'Use deep breathing and sensory awareness to bring yourself back to the present moment.',
  },
  {
    id: '2',
    title: 'Calming Music',
    description: 'Enjoy a curated playlist designed to soothe and relax your mind.',
    details: 'Let the power of music help reduce stress and improve your mood.',
  },
];

const purposeContent: ContentItem[] = [
  {
    id: '1',
    title: 'Meditation Practices',
    description: 'Explore different meditation techniques for daily calm.',
    details: 'From mindfulness to guided meditations, find what works best for you.',
  },
  {
    id: '2',
    title: 'Holistic Remedies',
    description: 'Discover remedies such as acupuncture and aromatherapy.',
    details: 'Learn how these approaches can contribute to a balanced mental state.',
  },
];

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter function: returns only the items that match the search query.
  const filterContent = (data: ContentItem[]): ContentItem[] => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.details && item.details.toLowerCase().includes(query))
    );
  };

  // Helper function to render a section with cards.
  const renderSection = (sectionTitle: string, data: ContentItem[]) => {
    const filteredData = filterContent(data);
    if (filteredData.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        {filteredData.map((item: ContentItem) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={(event: GestureResponderEvent) => {
              // Example: Log or navigate to a detailed view for this content item
              console.log(`Selected: ${item.title}`);
            }}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            {item.details && <Text style={styles.cardDetails}>{item.details}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Discover Mental Well-Being</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      {renderSection('Awareness', awarenessContent)}
      {renderSection('Connection', connectionContent)}
      {renderSection('Insight', insightContent)}
      {renderSection('Purpose', purposeContent)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  cardDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: '#777',
  },
});

export default Discover;
