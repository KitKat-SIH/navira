import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SOSButtonProps {
  onLongPress?: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onLongPress }) => {
  const handleLongPress = () => {
    Alert.alert(
      'SOS Triggered!',
      'Emergency services have been notified. Your location and itinerary have been shared with authorities and emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive' }
      ]
    );
    onLongPress?.();
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={2000}
      style={styles.sosButton}
    >
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
