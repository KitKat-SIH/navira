import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface CompanionManagementScreenProps {
  navigation: any;
}

export const CompanionManagementScreen: React.FC<CompanionManagementScreenProps> = ({ navigation }) => {
  const { companions } = useApp();

  const handleAddViaQR = () => {
    // TODO: Implement QR code scanning
    console.log('Add companion via QR');
  };

  const handleSendInviteLink = () => {
    // TODO: Implement invite link functionality
    console.log('Send invite link');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'text-green-700 bg-green-100';
      case 'moderate':
        return 'text-amber-700 bg-amber-100';
      case 'unsafe':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Companion Management</Text>
      </View>

      {/* Add Companion Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={handleAddViaQR} style={styles.actionBtn}> 
          <Text style={styles.actionBtnText}>Add via QR</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSendInviteLink} style={styles.actionBtn}> 
          <Text style={styles.actionBtnText}>Send Invite Link</Text>
        </TouchableOpacity>
      </View>

      {/* Companions List */}
      <Text style={styles.sectionLabel}>YOUR COMPANIONS</Text>
      <View style={styles.card}>
        {companions.map((companion, idx) => (
          <View key={companion.id} style={[styles.listItem, idx < companions.length - 1 && styles.dividerBelow]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: companion.avatar }} style={styles.avatar} />
              <Text style={styles.itemTitle}>{companion.name}</Text>
            </View>
            <View style={[styles.statusPill, getStatusColor(companion.status) === 'text-green-700 bg-green-100' ? { backgroundColor: '#dcfce7' } : getStatusColor(companion.status) === 'text-amber-700 bg-amber-100' ? { backgroundColor: '#fef3c7' } : { backgroundColor: '#fee2e2' }]}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#111827' }}>{companion.status.toUpperCase()}</Text>
            </View>
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
  actionsRow: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 20,
  },
  actionBtn: { 
    flex: 1, 
    backgroundColor: '#dbeafe', 
    paddingVertical: 16, 
    borderRadius: 10,
  },
  actionBtnText: { color: '#1e40af', fontWeight: '700', textAlign: 'center' },
  sectionLabel: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#6b7280', 
    marginBottom: 10, 
    paddingHorizontal: 4,
  },
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
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  itemTitle: { fontWeight: '700', color: '#111827' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
});