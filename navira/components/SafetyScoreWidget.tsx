import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

interface SafetyScoreWidgetProps {
  onPress?: () => void;
  size?: 'small' | 'large';
}

export const SafetyScoreWidget: React.FC<SafetyScoreWidgetProps> = ({ 
  onPress, 
  size = 'small' 
}) => {
  const { safetyScore } = useApp();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#16a34a';
      case 'moderate': return '#ca8a04';
      case 'unsafe': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'safe': return '#dcfce7';
      case 'moderate': return '#fef3c7';
      case 'unsafe': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  if (size === 'large') {
    return (
      <View style={styles.largeContainer}>
        <Text style={styles.largeLabel}>Live Safety Score</Text>
        <Text style={[styles.largeScore, { color: getStatusColor(safetyScore.status) }]}>
          {safetyScore.score}
        </Text>
        <View style={[styles.largeStatusContainer, { backgroundColor: getStatusBgColor(safetyScore.status) }]}>
          <Text style={[styles.largeStatusText, { color: getStatusColor(safetyScore.status) }]}>
            STATUS: {safetyScore.status.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.smallContainer}
    >
      <Text style={[styles.smallScore, { color: getStatusColor(safetyScore.status) }]}>
        {safetyScore.score}
      </Text>
      <Text style={styles.smallStatus}>
        {safetyScore.status.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  largeContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  largeLabel: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  largeScore: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
  },
  largeStatusContainer: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  largeStatusText: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  smallContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  smallScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  smallStatus: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: -4,
  },
});
