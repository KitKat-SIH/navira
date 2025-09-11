import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';

// Import screens
import { HomeScreen } from './screens/HomeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { QRCodeScreen } from './screens/QRCodeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EmergencyContactsScreen } from './screens/EmergencyContactsScreen';
import { CompanionManagementScreen } from './screens/CompanionManagementScreen';
import { DataSharingScreen } from './screens/DataSharingScreen';

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
            if (route === 'SOS') return nav.navigate('Home');
            return nav.navigate(route as never);
          }}
        />
      )}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen}
        options={{ tabBarLabel: 'Planner' }}
      />
      <Tab.Screen name="SOS" component={SOSTriggerScreen} />
      <Tab.Screen 
        name="QRCode" 
        component={QRCodeScreen}
        options={{ tabBarLabel: 'QR Code' }}
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
      <Stack.Screen name="Tabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootStack />
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({});