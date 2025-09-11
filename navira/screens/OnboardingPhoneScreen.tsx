import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingPhoneScreenProps {
  navigation: any;
}

export const OnboardingPhoneScreen: React.FC<OnboardingPhoneScreenProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState<'phone' | 'otp'>('phone');

  const handleSendOtp = () => {
    if (!phone.trim()) {
      return Alert.alert('Enter Phone Number', 'Please enter your phone number to continue.');
    }
    setStage('otp');
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      return Alert.alert('Enter OTP', 'Please enter the OTP sent to your phone.');
    }
    navigation.navigate('OnboardingVerifyId');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Welcome to Navira</Text>
      </View>

      <View style={styles.sectionGap}>
        {/* Phone Number */}
        <View>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call" size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder="e.g., +91 98765 43210"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* OTP (demo) */}
        {stage === 'otp' && (
          <View>
            <Text style={styles.label}>Enter OTP</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="key" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                placeholder="6-digit code"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </View>
        )}

        {/* CTA */}
        {stage === 'phone' ? (
          <TouchableOpacity onPress={handleSendOtp} style={styles.cta}>
            <Text style={styles.ctaText}>Send OTP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleVerifyOtp} style={styles.cta}>
            <Text style={styles.ctaText}>Verify & Continue</Text>
          </TouchableOpacity>
        )}
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
  cta: { 
    backgroundColor: '#2563eb', 
    paddingVertical: 16, 
    borderRadius: 10,
    marginTop: 8,
  },
  ctaText: { color: 'white', fontWeight: '700', textAlign: 'center' },
});


