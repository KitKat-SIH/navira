import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import { HomeScreen } from './screens/HomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { ItineraryScreen } from './screens/ItineraryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EmergencyContactsScreen } from './screens/EmergencyContactsScreen';
import { CompanionManagementScreen } from './screens/CompanionManagementScreen';
import { DataSharingScreen } from './screens/DataSharingScreen';
import { OnboardingPhoneScreen } from './screens/OnboardingPhoneScreen';
import { OnboardingVerifyIdScreen } from './screens/OnboardingVerifyIdScreen';
import { SOSActivatedScreen } from './screens/SOSActivatedScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dummy screen used for SOS tab action
function SOSTriggerScreen() {
  return <View />;
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="CompanionManagement" component={CompanionManagementScreen} />
      <Stack.Screen name="DataSharing" component={DataSharingScreen} />
    </Stack.Navigator>
  );
}

// Onboarding Stack
function OnboardingStack({ onComplete }: { onComplete: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingPhone" component={OnboardingPhoneScreen} />
      <Stack.Screen name="OnboardingVerifyId">
        {(props) => (
          <OnboardingVerifyIdScreen {...props} onComplete={onComplete} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Main Tab Navigator (excludes Home; includes a central SOS action)
function MainTabs({ navigation }: any) {
  return (
    <Tab.Navigator
      backBehavior="none"
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation: nav }) => (
        <BottomNav
          activeRoute={state.routes[state.index]?.name}
          onNavigate={(route) => {
            if (route === 'SOS') {
              // Navigate to root-level SOS screen
              (nav.getParent() as any)?.navigate('SOSActivated');
              return;
            }
            return nav.navigate(route as never);
          }}
        />
      )}
    >
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen}
        options={{ tabBarLabel: 'Planner' }}
      />
      <Tab.Screen name="SOS" component={SOSTriggerScreen} />
      <Tab.Screen 
        name="Itinerary" 
        component={ItineraryScreen}
        options={{ tabBarLabel: 'Itinerary' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Root stack: Home as default; tabs as secondary views. Back from tab routes returns to Home.
function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SOSActivated" component={SOSActivatedScreen} />
      <Stack.Screen name="Tabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const val = await AsyncStorage.getItem('navira:onboarded');
        setIsOnboarded(val === 'true');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleOnboardingComplete = React.useCallback(() => {
    setIsOnboarded(true);
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={{ marginTop: 8, color: '#6b7280' }}>Loading...</Text>
          </View>
        ) : isOnboarded ? (
          <RootStack />
        ) : (
          <OnboardingStack onComplete={handleOnboardingComplete} />
        )}
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({});