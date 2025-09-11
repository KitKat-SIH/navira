import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, setUser, liveTracking, dataSharing, toggleLiveTracking, updateDataSharing, language, setLanguage } = useApp();

  const handleDeleteData = () => {
    // TODO: Implement delete data functionality
    console.log('Delete data requested');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image source={{ uri: user.avatar || 'https://placehold.co/100x100/e2e8f0/333333?text=TS' }} style={styles.avatar} />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <View style={styles.sectionGap}>
          {/* Account Section */}
          <View>
            <Text style={styles.sectionLabel}>ACCOUNT</Text>
            <View style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('EmergencyContacts')} style={styles.listItem}>
                <Text style={styles.listItemText}>Emergency Contacts</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity onPress={() => navigation.navigate('DataSharing')} style={styles.listItem}>
                <Text style={styles.listItemText}>Data Sharing Preferences</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* General Section */}
          <View>
            <Text style={styles.sectionLabel}>GENERAL</Text>
            <View style={styles.card}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>Language</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => setLanguage('en')}>
                    <Text style={[styles.pill, language === 'en' ? styles.pillActiveText : styles.pillText]}>EN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setLanguage('hi')}>
                    <Text style={[styles.pill, language === 'hi' ? styles.pillActiveText : styles.pillText]}>HI</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Delete Data Section */}
          <View style={{ paddingTop: 8 }}>
            <TouchableOpacity onPress={handleDeleteData} style={styles.dangerBtn}>
              <Text style={styles.dangerBtnText}>Delete Data / Revoke ID</Text>
            </TouchableOpacity>
            <Text style={styles.caption}>
              This action is irreversible and will permanently delete your account and digital ID.
            </Text>
          </View>
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
  profileInfo: { 
    alignItems: 'center', 
    marginBottom: 24, 
    paddingVertical: 8,
  },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  profileName: { 
    marginTop: 16, 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1f2937',
  },
  profileEmail: { 
    color: '#6b7280', 
    marginTop: 4,
  },
  sectionGap: { gap: 20 },
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
  },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    minHeight: 56,
  },
  listItemText: { color: '#374151' },
  divider: { 
    height: 1, 
    backgroundColor: '#e5e7eb', 
    marginHorizontal: 16,
  },
  secondaryText: { fontSize: 12, color: '#6b7280' },
  dangerBtn: { 
    backgroundColor: '#fee2e2', 
    paddingVertical: 16, 
    borderRadius: 10,
  },
  dangerBtnText: { color: '#b91c1c', fontWeight: '700', textAlign: 'center' },
  caption: { 
    fontSize: 12, 
    color: '#6b7280', 
    textAlign: 'center', 
    marginTop: 12, 
    paddingHorizontal: 8, 
    lineHeight: 16,
  },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db' },
  pillText: { color: '#374151', fontWeight: '700' },
  pillActiveText: { color: '#2563eb', fontWeight: '700' },
});