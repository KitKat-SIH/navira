import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

// Helper to read .env or app config
const getEnv = (key: string): string | undefined => {
  return Constants?.expoConfig?.extra?.[key];
};

export const SOSButton: React.FC = () => {
  const sendSOS = async () => {
    try {
      // Ask permission & get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to send SOS.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});

      // Open websocket
      const wsUrl = getEnv('WS_URL');
      if (!wsUrl) {
        Alert.alert('Error', 'WS_URL not configured in app config.');
        return;
      }
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        const payload = {
          type: 'sos',
          encrypted_id: getEnv('ENCRYPTED_ID') || 'unknown',
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
          timestamp: new Date().toISOString(),
        };
        ws.send(JSON.stringify(payload));
        ws.close();
        Alert.alert('🚨 SOS Sent', 'Your location and ID have been shared.');
      };

      ws.onerror = (err) => {
        console.warn('SOS WebSocket error', err);
        Alert.alert('Error', 'Failed to send SOS.');
      };
    } catch (e) {
      console.warn('SOS send failed', e);
      Alert.alert('Error', 'Unexpected failure while sending SOS.');
    }
  };

  const handlePress = () => {
    Alert.alert(
      'Confirm SOS',
      'Emergency services will be notified. Do you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: sendSOS }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.sosButton}>
      <Ionicons name="warning" size={40} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sosButton: {
    width: 80,
    height: 80,
    backgroundColor: '#ef4444',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
});
