import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  StyleSheet
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { SafetyScoreWidget } from '../components/SafetyScoreWidget';
import { SOSButton } from '../components/SOSButton';
import { FeedCard } from '../components/FeedCard';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';

const { width, height } = Dimensions.get('window');

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { feedItems } = useApp();
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  const mapHeight = isMapFullscreen ? height : height * 0.3;

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      }));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Map Section */}
        <View style={[styles.mapContainer, { height: mapHeight }]}> 
          <MapView
            style={styles.map}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {/* User Location Marker */}
            <Marker
              coordinate={{ latitude: region.latitude, longitude: region.longitude }}
              title="Your Location"
              description="Current position"
            />
          </MapView>

          {/* Heatmap Overlay (simulated) */}
          <View style={styles.heatmapOverlay} />

          {/* Safety Score Widget - moved to left to avoid overlap */}
          <View style={styles.safetyWidgetLeft}>
            <SafetyScoreWidget />
          </View>

          {/* Fullscreen Toggle Button */}
          <TouchableOpacity
            onPress={toggleMapFullscreen}
            style={styles.fullscreenButton}
          >
            <Ionicons 
              name={isMapFullscreen ? "contract" : "expand"} 
              size={24} 
              color="#374151" 
            />
          </TouchableOpacity>
        </View>

        {/* Live Feed Section */}
        <View style={styles.feedContainer}>
          <Text style={styles.feedTitle}>Live Feed</Text>
          <View style={styles.feedList}>
            {feedItems.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Dashboard summary below */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={styles.feedTitle}>Safety Dashboard</Text>
          <SafetyScoreWidget size="large" />
          <View style={{ backgroundColor: '#ffffff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
            <Text style={{ fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>Contributing Factors</Text>
            <Text style={{ color: '#374151', marginBottom: 6 }}>Area Risk: Low</Text>
            <Text style={{ color: '#374151', marginBottom: 6 }}>Anomalies Detected: None</Text>
            <Text style={{ color: '#374151' }}>Itinerary Deviation: On Track</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navbar */}
      {!isMapFullscreen && (
        <BottomNav
          activeRoute={'Home'}
          onNavigate={(route) => {
            if (route === 'SOS') return; // handled by Tabs handler
            if (route === 'Home') return navigation.navigate('Home');
            return navigation.navigate('Tabs', { screen: route });
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  mapContainer: {
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  heatmapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '25%',
    width: 128,
    height: 128,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 64,
  },
  safetyWidgetLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Space for bottom navbar
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  feedList: {
    gap: 12,
  },
  // CONSISTENT BOTTOM NAVBAR STYLES
  bottomNavbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
    zIndex: 40,
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  navTabLabel: {
    fontSize: 10,
    color: '#374151',
    marginTop: 4,
    fontWeight: '500',
  },
  sosButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 5,
  },
});