import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
  title?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = "TouristSafe" }) => {
  return (
    <View className="bg-white p-3 flex-row justify-between items-center border-b border-gray-200">
      <View className="flex-row items-center space-x-2">
        <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
        <Text className="font-bold text-gray-800 text-lg">{title}</Text>
      </View>
    </View>
  );
};
