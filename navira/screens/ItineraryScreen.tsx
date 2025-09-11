import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ItineraryScreen: React.FC = () => {
  const entries = [
    { id: '1', place: 'Indira Gandhi Intl Airport (DEL)', type: 'Airport', date: '2025-09-12', time: '08:40' },
    { id: '2', place: 'New Delhi Railway Station', type: 'Railway', date: '2025-09-12', time: '12:15' },
    { id: '3', place: 'Jaipur Marriott Hotel', type: 'Hotel', date: '2025-09-12', time: '15:30' },
    { id: '4', place: 'Amber Fort', type: 'Checkpoint', date: '2025-09-13', time: '10:00' },
    { id: '5', place: 'Cafe Hawamahal', type: 'Inn', date: '2025-09-13', time: '13:10' },
    { id: '6', place: 'Jaipur Junction', type: 'Railway', date: '2025-09-14', time: '09:25' },
    { id: '7', place: 'Lalit New Delhi', type: 'Hotel', date: '2025-09-14', time: '14:50' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Your Itinerary</Text>
      </View>
      {/* Past Trips placeholder card */}
      <View style={[styles.card, { marginBottom: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time" size={20} color="#2563eb" />
            <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Past Trips</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </View>
      </View>

      {/* Upcoming Checkpoints card */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="map" size={20} color="#2563eb" />
          <Text style={[styles.cardTitle, { marginLeft: 8 }]}>Upcoming Checkpoints</Text>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Place</Text>
          <Text style={[styles.th, { flex: 1 }]}>Type</Text>
          <Text style={[styles.th, { flex: 1 }]}>Date</Text>
          <Text style={[styles.th, { flex: 1 }]}>Time</Text>
        </View>
        {entries.map((e, idx) => (
          <View key={e.id} style={[styles.tableRow, idx < entries.length - 1 && styles.rowDivider]}>
            <Text style={[styles.td, { flex: 2 }]}>{e.place}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{e.type}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{e.date}</Text>
            <Text style={[styles.td, { flex: 1 }]}>{e.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 24, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb', 
    paddingBottom: 16,
    paddingTop: 8,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1f2937',
    textAlign: 'center',
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 6, 
    elevation: 2, 
  },
  cardTitle: { fontWeight: '700', color: '#1f2937' },
  pastTrips: { color: '#2563eb', fontWeight: '700' },
  tableHeader: { flexDirection: 'row', marginTop: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  th: { fontWeight: '700', color: '#374151', fontSize: 12 },
  tableRow: { flexDirection: 'row', paddingVertical: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  td: { color: '#374151', fontSize: 12 },
});


