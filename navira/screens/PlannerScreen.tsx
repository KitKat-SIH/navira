import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const PlannerScreen: React.FC = () => {
  const [startLocation, setStartLocation] = useState('Your Current Location');
  const [destination, setDestination] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('safest');
  const [selectedProfile, setSelectedProfile] = useState('');

  const routeOptions = [
    { id: 'fastest', label: 'Fastest' },
    { id: 'shortest', label: 'Shortest' },
    { id: 'safest', label: 'Safest' },
  ];

  const travelProfiles = [
    { id: 'night', label: 'Night Travel', icon: 'moon' },
    { id: 'solo-female', label: 'Solo Female', icon: 'person' },
    { id: 'family', label: 'Family', icon: 'people' },
  ];

  const handleFindRoute = () => {
    // TODO: Implement route finding logic
    console.log('Finding route...', { startLocation, destination, selectedRoute, selectedProfile });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Route Planner</Text>
      </View>

      <View style={styles.sectionGap}>
          {/* Inputs */}
          <View style={styles.inputGroup}>
            <View>
              <Text style={styles.label}>Start</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  value={startLocation}
                  onChangeText={setStartLocation}
                  style={styles.input}
                  placeholder="Your Current Location"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Destination</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="flag" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  value={destination}
                  onChangeText={setDestination}
                  style={styles.input}
                  placeholder="e.g., India Gate"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* Route Options */}
          <View>
            <Text style={styles.label}>Route Options</Text>
            <View style={styles.rowGap}>
              {routeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedRoute(option.id)}
                  style={[
                    styles.pill,
                    selectedRoute === option.id ? styles.pillActive : styles.pillInactive,
                  ]}
                >
                  <Text style={selectedRoute === option.id ? styles.pillTextActive : styles.pillText}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Travel Profiles */}
          <View>
            <Text style={styles.label}>Travel Profile</Text>
            <View style={styles.rowGap}>
              {travelProfiles.map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  onPress={() => setSelectedProfile(profile.id)}
                  style={[
                    styles.profileCard,
                    selectedProfile === profile.id ? styles.profileCardActive : styles.profileCardInactive,
                  ]}
                >
                  <Ionicons 
                    name={profile.icon as any} 
                    size={24} 
                    color={selectedProfile === profile.id ? '#2563eb' : '#6b7280'} 
                  />
                  <Text style={[styles.profileLabel, { color: selectedProfile === profile.id ? '#2563eb' : '#374151' }]}>
                    {profile.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity onPress={handleFindRoute} style={styles.cta}>
            <Text style={styles.ctaText}>Find Route</Text>
          </TouchableOpacity>
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
  sectionGap: { gap: 28 },
  inputGroup: { gap: 16 },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8,
  },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 12, zIndex: 1 },
  input: { 
    paddingLeft: 44, 
    paddingRight: 16, 
    paddingVertical: 14, 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 8, 
    backgroundColor: '#ffffff',
  },
  rowGap: { flexDirection: 'row', gap: 12 },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  pillActive: { backgroundColor: '#2563eb' },
  pillInactive: { backgroundColor: '#e5e7eb' },
  pillTextActive: { color: '#ffffff', fontWeight: '700' },
  pillText: { color: '#374151', fontWeight: '700' },
  profileCard: { 
    flex: 1, 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 8, 
    borderWidth: 1,
  },
  profileCardActive: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
  profileCardInactive: { backgroundColor: '#ffffff', borderColor: '#d1d5db' },
  profileLabel: { fontSize: 12, marginTop: 6, textAlign: 'center', fontWeight: '600' },
  cta: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 16, 
    borderRadius: 10,
    marginTop: 8,
  },
  ctaText: { color: 'white', fontWeight: '700', textAlign: 'center' },
});