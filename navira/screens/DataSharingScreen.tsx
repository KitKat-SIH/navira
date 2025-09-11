// DataSharingScreen.tsx - REMOVED "Itinerary with Authorities" option
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface DataSharingScreenProps {
  navigation: any;
}

export const DataSharingScreen: React.FC<DataSharingScreenProps> = ({ navigation }) => {
  const { dataSharing, updateDataSharing } = useApp();

  // REMOVED "itineraryWithAuthorities" option as requested
  const dataSharingOptions = [
    {
      key: 'anonymizedLocation' as keyof typeof dataSharing,
      title: 'Anonymized Location',
      description: 'Contributes to public safety heatmaps.',
    },
    {
      key: 'allowFamilyTracking' as keyof typeof dataSharing,
      title: 'Allow Family Tracking',
      description: 'Lets emergency contacts view your location.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* CONSISTENT HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Sharing Preferences</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        You are in control of your data. Choose what you share to enhance your safety and contribute to the community.
      </Text>

      {/* Data Sharing Options */}
      <View style={styles.card}>
        {dataSharingOptions.map((option, index) => (
          <View key={option.key}>
            <View style={styles.listItem}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.itemTitle}>{option.title}</Text>
                <Text style={styles.itemSubtitle}>{option.description}</Text>
              </View>
              <Switch
                value={dataSharing[option.key]}
                onValueChange={(value) => updateDataSharing(option.key, value)}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>
            {index < dataSharingOptions.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  // CONSISTENT HEADER STYLES
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb', 
    paddingBottom: 16, 
    paddingTop: 8,
  },
  backBtn: { 
    padding: 10, 
    marginLeft: -10,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  headerSpacer: { width: 44 }, // Balance the back button
  description: { 
    fontSize: 13, 
    color: '#4b5563', 
    marginBottom: 20, 
    lineHeight: 18, 
    paddingHorizontal: 2,
  },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 6, 
    elevation: 2,
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    minHeight: 56,
  },
  divider: { 
    height: 1, 
    backgroundColor: '#e5e7eb', 
    marginHorizontal: 16,
  },
  itemTitle: { 
    fontWeight: '700', 
    color: '#111827',
    marginBottom: 2,
  },
  itemSubtitle: { 
    fontSize: 12, 
    color: '#6b7280',
    lineHeight: 16,
  },
});