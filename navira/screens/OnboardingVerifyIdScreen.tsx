import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import Constants from 'expo-constants';

interface OnboardingVerifyIdScreenProps {
  navigation: any;
  onComplete?: () => void;
}

const ID_TYPES = [
  { id: 'aadhar', label: 'Aadhar' },
  { id: 'pan', label: 'PAN Card' },
  { id: 'passport', label: 'Passport' },
  { id: 'dl', label: 'Driving License' },
];

export const OnboardingVerifyIdScreen: React.FC<OnboardingVerifyIdScreenProps> = ({ navigation, onComplete }) => {
  const [idType, setIdType] = useState(ID_TYPES[0].id);
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState('');
  const [tripDuration, setTripDuration] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { addEmergencyContact, setUser } = useApp();

  const getEnv = (key: string): string | undefined => {
    // Access from Expo Constants extra config
    return Constants?.expoConfig?.extra?.[key];
  };

  const encryptData = async (data: string): Promise<string | null> => {
    try {
      const apiBase = getEnv('API_BASE_URL');
      if (!apiBase) {
        throw new Error('API_BASE_URL not configured');
      }
      const response = await fetch(`${apiBase.replace(/\/$/, '')}/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error('Encryption failed');
      const result = await response.json();
      return result.encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  };

  const handleComplete = async () => {
    if (!idNumber.trim()) {
      return Alert.alert('Enter ID Number', 'Please enter your selected ID number.');
    }
    if (!dob.trim()) {
      return Alert.alert('Enter Date of Birth', 'Please enter your date of birth.');
    }
    if (!tripDuration.trim()) {
      return Alert.alert('Enter Trip Duration', 'Please enter your trip duration (e.g., 5 days).');
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      return Alert.alert('Emergency Contact', 'Please provide an emergency contact name and phone.');
    }

    // Format data as per sampledata.json structure
    const touristData = {
      tourists: [{
        touristID: `T${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        dob: dob,
        mobileNumber: contactPhone,
        tripDuration: tripDuration,
        officialID: idNumber,
        emergencyContacts: JSON.stringify([{
          name: contactName,
          contact: contactPhone,
          relation: contactRelationship || 'Emergency Contact'
        }])
      }]
    };

    // Encrypt the data
    const encryptedData = await encryptData(JSON.stringify(touristData));
    
    if (encryptedData) {
      // Store encrypted data in user context for QR display
      setUser(prev => ({
        ...prev,
        digitalId: encryptedData,
        idValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
      }));
    } else {
      // Fallback: store plaintext with flag for retry
      await AsyncStorage.setItem('navira:onboarding_pending', JSON.stringify(touristData));
    }

    addEmergencyContact({ name: contactName, relationship: contactRelationship || 'Emergency Contact', phone: contactPhone });
    // Save profile display fields (not used in QR)
    setUser(prev => ({ ...prev, name: fullName || prev.name, email: email || prev.email }));
    await AsyncStorage.setItem('navira:onboarded', 'true');
    onComplete?.();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your ID</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.sectionGap}>
        {/* ID Type Dropdown (basic) */}
        <View>
          <Text style={styles.label}>ID Type</Text>
          <TouchableOpacity onPress={() => setDropdownOpen(!dropdownOpen)} style={[styles.input, { paddingLeft: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={{ color: '#111827' }}>{ID_TYPES.find(t => t.id === idType)?.label}</Text>
            <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#6b7280" />
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={styles.dropdown}>
              {ID_TYPES.map((t) => (
                <TouchableOpacity key={t.id} onPress={() => { setIdType(t.id); setDropdownOpen(false); }} style={styles.dropdownItem}>
                  <Text style={{ color: '#111827' }}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Full Name */}
        <View>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Email */}
        <View>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* ID Number */}
        <View>
          <Text style={styles.label}>ID Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="card" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              value={idNumber}
              onChangeText={setIdNumber}
              style={styles.input}
              placeholder="Enter your ID number"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Date of Birth */}
        <View>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="calendar" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              value={dob}
              onChangeText={setDob}
              style={styles.input}
              placeholder="YYYY-MM-DD (e.g., 1990-05-15)"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Trip Duration */}
        <View>
          <Text style={styles.label}>Trip Duration</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="time" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              value={tripDuration}
              onChangeText={setTripDuration}
              style={styles.input}
              placeholder="e.g., 5 days"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <View>
          <Text style={styles.label}>Emergency Contact</Text>
          <View style={{ gap: 12 }}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                value={contactName}
                onChangeText={setContactName}
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="people" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                value={contactRelationship}
                onChangeText={setContactRelationship}
                style={styles.input}
                placeholder="Relationship (e.g., Sister)"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="call" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity onPress={handleComplete} style={styles.cta}>
          <Text style={styles.ctaText}>Finish</Text>
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
    justifyContent: 'space-between',
    marginBottom: 24, 
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
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1f2937',
    textAlign: 'center',
    flex: 1,
  },
  sectionGap: { gap: 20 },
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
  dropdown: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cta: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 16, 
    borderRadius: 10,
    marginTop: 8,
  },
  ctaText: { color: 'white', fontWeight: '700', textAlign: 'center' },
});


