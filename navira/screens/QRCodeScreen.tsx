import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useApp } from '../context/AppContext';

export const QRCodeScreen: React.FC = () => {
  const { user } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Your Digital ID</Text>
      </View>

      {/* QR Code Section */}
      <View style={styles.centered}>
        <View style={styles.qrCard}>
          <QRCode value={user.digitalId} size={220} color="#000000" backgroundColor="#ffffff" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>ID Valid Until: {user.idValidUntil}</Text>
        <Text style={styles.description}>
          Present this QR code at designated checkpoints, hotels, and to authorities for verification.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 32, 
    paddingTop: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  centered: { alignItems: 'center' },
  qrCard: { 
    backgroundColor: '#ffffff', 
    padding: 32, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 6, 
    elevation: 2, 
    marginBottom: 24,
  },
  name: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1f2937', 
    marginTop: 16,
  },
  subtitle: { 
    color: '#6b7280', 
    marginTop: 6,
  },
  description: { 
    marginTop: 16, 
    fontSize: 13, 
    color: '#4b5563', 
    textAlign: 'center', 
    maxWidth: 320,
    lineHeight: 18,
  },
});