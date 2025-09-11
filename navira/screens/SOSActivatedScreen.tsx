import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SOSActivatedScreen: React.FC<any> = ({ navigation }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="warning" size={48} color="#ef4444" />
        <Text style={styles.title}>SOS Activated</Text>
        <Text style={styles.subtitle}>Emergency services have been notified.</Text>
        <Text style={styles.caption}>This screen will close automatically.</Text>
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


