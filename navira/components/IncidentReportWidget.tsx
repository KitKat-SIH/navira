import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IncidentReportWidgetProps {
  onPress: () => void;
}

export const IncidentReportWidget: React.FC<IncidentReportWidgetProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.widget} onPress={onPress}>
      <Ionicons name="add" size={24} color="#ffffff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widget: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
