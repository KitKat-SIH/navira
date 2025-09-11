import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafetyScoreWidget } from '../components/SafetyScoreWidget';
import { useApp } from '../context/AppContext';

export const DashboardScreen: React.FC = () => {
  const { safetyScore } = useApp();

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case 'areaRisk':
        return 'location';
      case 'anomaliesDetected':
        return 'eye';
      case 'itineraryDeviation':
        return 'map';
      default:
        return 'information-circle';
    }
  };

  const getFactorColor = (value: string) => {
    switch (value) {
      case 'low':
      case 'none':
      case 'on track':
        return 'text-green-700';
      case 'moderate':
      case 'some':
      case 'minor':
        return 'text-yellow-700';
      case 'high':
      case 'many':
      case 'major':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getFactorBgColor = (value: string) => {
    switch (value) {
      case 'low':
      case 'none':
      case 'on track':
        return 'bg-green-100';
      case 'moderate':
      case 'some':
      case 'minor':
        return 'bg-yellow-100';
      case 'high':
      case 'many':
      case 'major':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getFactorIconColor = (value: string) => {
    switch (value) {
      case 'low':
      case 'none':
      case 'on track':
        return '#16a34a';
      case 'moderate':
      case 'some':
      case 'minor':
        return '#ca8a04';
      case 'high':
      case 'many':
      case 'major':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Safety Dashboard</Text>
      </View>

      {/* Safety Score */}
      <SafetyScoreWidget size="large" />

      {/* Contributing Factors */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contributing Factors</Text>
        <View style={styles.factorList}>
          <View style={styles.factorRow}>
              <View className={`w-10 h-10 ${getFactorBgColor(safetyScore.factors.areaRisk)} rounded-full flex items-center justify-center`}>
                <Ionicons 
                  name={getFactorIcon('areaRisk') as any} 
                  size={20} 
                  color={getFactorIconColor(safetyScore.factors.areaRisk)} 
                />
              </View>
              <Text style={styles.factorText}>
                Area Risk: <Text style={[styles.factorValue, { color: getFactorIconColor(safetyScore.factors.areaRisk) }]}>
                  {safetyScore.factors.areaRisk.charAt(0).toUpperCase() + safetyScore.factors.areaRisk.slice(1)}
                </Text>
              </Text>
          </View>

          <View style={styles.factorRow}>
              <View className={`w-10 h-10 ${getFactorBgColor(safetyScore.factors.anomaliesDetected)} rounded-full flex items-center justify-center`}>
                <Ionicons 
                  name={getFactorIcon('anomaliesDetected') as any} 
                  size={20} 
                  color={getFactorIconColor(safetyScore.factors.anomaliesDetected)} 
                />
              </View>
              <Text style={styles.factorText}>
                Anomalies Detected: <Text style={[styles.factorValue, { color: getFactorIconColor(safetyScore.factors.anomaliesDetected) }]}>
                  {safetyScore.factors.anomaliesDetected.charAt(0).toUpperCase() + safetyScore.factors.anomaliesDetected.slice(1)}
                </Text>
              </Text>
          </View>

          <View style={styles.factorRow}>
              <View className={`w-10 h-10 ${getFactorBgColor(safetyScore.factors.itineraryDeviation)} rounded-full flex items-center justify-center`}>
                <Ionicons 
                  name={getFactorIcon('itineraryDeviation') as any} 
                  size={20} 
                  color={getFactorIconColor(safetyScore.factors.itineraryDeviation)} 
                />
              </View>
              <Text style={styles.factorText}>
                Itinerary Deviation: <Text style={[styles.factorValue, { color: getFactorIconColor(safetyScore.factors.itineraryDeviation) }]}>
                  {safetyScore.factors.itineraryDeviation.charAt(0).toUpperCase() + safetyScore.factors.itineraryDeviation.slice(1)}
                </Text>
              </Text>
          </View>
        </View>
      </View>

      {/* Suggestion */}
      {safetyScore.suggestion && (
        <View style={styles.suggestion}>
          <Ionicons name="bulb" size={24} color="#2563eb" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.suggestionTitle}>Suggestion</Text>
            <Text style={styles.suggestionText}>{safetyScore.suggestion}</Text>
          </View>
        </View>
      )}
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
  card: { 
    backgroundColor: '#ffffff', 
    padding: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 6, 
    elevation: 2, 
    marginBottom: 20,
  },
  cardTitle: { 
    fontWeight: '700', 
    color: '#1f2937', 
    marginBottom: 16, 
    fontSize: 16,
  },
  factorList: { gap: 16 },
  factorRow: { flexDirection: 'row', alignItems: 'center' },
  factorText: { marginLeft: 16, color: '#374151' },
  factorValue: { fontWeight: '600' },
  suggestion: { backgroundColor: '#dbeafe', borderLeftWidth: 4, borderLeftColor: '#3b82f6', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  suggestionTitle: { fontWeight: '700', color: '#1e40af' },
  suggestionText: { color: '#1d4ed8', fontSize: 13 },
});