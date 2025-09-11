import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

interface EmergencyContactsScreenProps {
  navigation: any;
}

export const EmergencyContactsScreen: React.FC<EmergencyContactsScreenProps> = ({ navigation }) => {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact } = useApp();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      {/* Add Contact Inline */}
      <View style={styles.card}>
        <View style={styles.listItem}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.itemTitle}>Add New Contact</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={{ padding: 16 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.itemSubtitle}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.itemSubtitle}>Relationship</Text>
            <TextInput
              value={relationship}
              onChangeText={setRelationship}
              style={styles.input}
              placeholder="e.g., Sister"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.itemSubtitle}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="e.g., +91 98765 43210"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!name || !phone) return;
              addEmergencyContact({ name, relationship, phone });
              setName(''); setRelationship(''); setPhone('');
            }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contacts List */}
      <View style={styles.card}>
        {emergencyContacts.map((contact, idx) => (
          <View key={contact.id} style={[styles.listItem, idx < emergencyContacts.length - 1 && styles.dividerBelow]}>
            <View>
              <Text style={styles.itemTitle}>{contact.name}</Text>
              <Text style={styles.itemSubtitle}>{contact.relationship}</Text>
            </View>
            <TouchableOpacity onPress={() => removeEmergencyContact(contact.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 24 },
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
    paddingHorizontal: 4,
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 22,
    paddingHorizontal: 20,
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
    paddingVertical: 18, 
    borderRadius: 10, 
    marginTop: 20,
  },
  ctaText: { color: 'white', fontWeight: '700', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#ffffff' },
});