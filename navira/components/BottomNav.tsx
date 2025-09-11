import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RouteName = 'Dashboard' | 'Planner' | 'SOS' | 'QRCode' | 'Profile';

interface BottomNavProps {
  activeRoute?: string;
  onNavigate: (route: RouteName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute, onNavigate }) => {
  const isActive = (name: RouteName) => activeRoute === name;

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.tab} onPress={() => onNavigate('Dashboard')}>
        <Ionicons name={isActive('Dashboard') ? 'analytics' : 'analytics-outline'} size={22} color="#374151" />
        <Text style={styles.label}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onNavigate('Planner')}>
        <Ionicons name={isActive('Planner') ? 'map' : 'map-outline'} size={22} color="#374151" />
        <Text style={styles.label}>Planner</Text>
      </TouchableOpacity>

      {/* Center spacer for raised SOS */}
      <View style={{ width: 100 }} />

      <TouchableOpacity style={styles.tab} onPress={() => onNavigate('QRCode')}>
        <Ionicons name={isActive('QRCode') ? 'qr-code' : 'qr-code-outline'} size={22} color="#374151" />
        <Text style={styles.label}>QR Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onNavigate('Profile')}>
        <Ionicons name={isActive('Profile') ? 'person' : 'person-outline'} size={22} color="#374151" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>

      {/* Raised SOS button */}
      <TouchableOpacity style={styles.centerSOS} onPress={() => onNavigate('SOS')} activeOpacity={0.85}>
        <View style={styles.centerSOSCircle}>
          <Ionicons name="warning" size={36} color="#ffffff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingBottom: Platform.select({ ios: 12, android: 10 }),
    zIndex: 40,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  centerSOS: {
    position: 'absolute',
    left: '50%',
    bottom: 14,
    marginLeft: -50,
    zIndex: 60,
  },
  centerSOSCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#ffffff',
  },
});

export default BottomNav;


