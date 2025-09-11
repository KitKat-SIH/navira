import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export const SOSActivatedScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useApp();
  const [countdown, setCountdown] = useState(10);

  const getEnv = (key: string): string | undefined => {
    return Constants?.expoConfig?.extra?.[key];
  };

  const sendSOS = async () => {
    try {
      const wsUrl = getEnv('WS_URL');
      if (!wsUrl) {
        console.warn('WebSocket URL not configured');
        return;
      }

      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Send SOS via WebSocket
      const ws = new WebSocket(wsUrl);
      
      await new Promise((resolve, reject) => {
        ws.onopen = () => {
          const payload = {
            type: 'sos',
            lat: latitude,
            lon: longitude,
            timestamp: new Date().toISOString(),
            encrypted_id: user.digitalId,
          };

          ws.send(JSON.stringify(payload));
          ws.close();
          resolve(true);
        };

        ws.onerror = (error) => {
          reject(error);
        };
      });

    } catch (error) {
      console.error('Failed to send SOS:', error);
    }
  };

  useEffect(() => {
    // Send SOS immediately
    sendSOS();

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation, user.digitalId]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="warning" size={48} color="#ef4444" />
        <Text style={styles.title}>SOS Activated</Text>
        <Text style={styles.subtitle}>Emergency services have been notified.</Text>
        <Text style={styles.caption}>This screen will close in {countdown} seconds.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  title: { marginTop: 12, fontSize: 20, fontWeight: '700', color: '#1f2937' },
  subtitle: { marginTop: 6, color: '#374151' },
  caption: { marginTop: 4, color: '#6b7280', fontSize: 12 },
});


