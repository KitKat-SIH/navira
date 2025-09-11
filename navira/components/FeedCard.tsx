import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../context/AppContext';

interface FeedCardProps {
  item: FeedItem;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item }) => {
  const getContainerColors = (type: string) => {
    switch (type) {
      case 'alert':
        return { bg: '#fef2f2', border: '#ef4444', title: '#991b1b', text: '#b91c1c' };
      case 'companion':
        return { bg: '#fffbeb', border: '#f59e0b', title: '#92400e', text: '#b45309' };
      case 'system':
        return { bg: '#eff6ff', border: '#3b82f6', title: '#1e40af', text: '#1d4ed8' };
      case 'info':
      default:
        return { bg: '#f3f4f6', border: '#9ca3af', title: '#111827', text: '#374151' };
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return 'warning';
      case 'companion':
        return 'people';
      case 'system':
        return 'information-circle';
      case 'info':
        return 'information';
      default:
        return 'information';
    }
  };

  const colors = getContainerColors(item.type);

  return (
    <View style={[styles.card, { backgroundColor: colors.bg, borderLeftColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Ionicons name={getIcon(item.type) as any} size={16} color={colors.border} />
        <Text style={[styles.title, { color: colors.title }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <Text style={[styles.message, { color: colors.text }]}>
        {item.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontWeight: '700',
    marginLeft: 8,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  message: {
    fontSize: 13,
  },
});
