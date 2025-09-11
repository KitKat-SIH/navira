import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface EmergencyContactsScreenProps {
  navigation: any;
}

export const EmergencyContactsScreen: React.FC<EmergencyContactsScreenProps> = ({ navigation }) => {
  const { emergencyContacts } = useApp();

  const handleRemoveContact = (id: string) => {
    // TODO: Implement remove contact functionality
    console.log('Remove contact:', id);
  };

  const handleAddContact = () => {
    // TODO: Implement add contact functionality
    console.log('Add new contact');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      {/* Contacts List */}
      <View style={styles.card}>
        {emergencyContacts.map((contact, idx) => (
          <View key={contact.id} style={[styles.listItem, idx < emergencyContacts.length - 1 && styles.dividerBelow]}>
            <View>
              <Text style={styles.itemTitle}>{contact.name}</Text>
              <Text style={styles.itemSubtitle}>{contact.relationship}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveContact(contact.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Contact Button */}
      <TouchableOpacity onPress={handleAddContact} style={styles.cta}>
        <Text style={styles.ctaText}>Add New Contact</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb', 
    paddingBottom: 16, 
    paddingTop: 8,
  },
  backBtn: { 
    padding: 10, 
    marginRight: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 6, 
    elevation: 2, 
    overflow: 'hidden',
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    minHeight: 48,
  },
  dividerBelow: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb',
  },
  itemTitle: { fontWeight: '700', color: '#111827' },
  itemSubtitle: { fontSize: 12, color: '#6b7280' },
  removeText: { color: '#dc2626', fontWeight: '700' },
  cta: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 16, 
    borderRadius: 10, 
    marginTop: 20,
  },
  ctaText: { color: 'white', fontWeight: '700', textAlign: 'center' },
});