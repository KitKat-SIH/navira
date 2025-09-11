import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  digitalId: string;
  idValidUntil: string;
}

export interface Companion {
  id: string;
  name: string;
  avatar: string;
  status: 'safe' | 'moderate' | 'unsafe';
  safetyScore: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface SafetyScore {
  score: number;
  status: 'safe' | 'moderate' | 'unsafe';
  factors: {
    areaRisk: 'low' | 'moderate' | 'high';
    anomaliesDetected: 'none' | 'some' | 'many';
    itineraryDeviation: 'on track' | 'minor' | 'major';
  };
  suggestion?: string;
}

export interface FeedItem {
  id: string;
  type: 'alert' | 'companion' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

interface AppContextType {
  user: User;
  setUser: (u: User) => void;
  companions: Companion[];
  emergencyContacts: EmergencyContact[];
  addEmergencyContact: (c: Omit<EmergencyContact, 'id'>) => EmergencyContact;
  safetyScore: SafetyScore;
  feedItems: FeedItem[];
  liveTracking: boolean;
  dataSharing: {
    anonymizedLocation: boolean;
    itineraryWithAuthorities: boolean;
    allowFamilyTracking: boolean;
  };
  language: string;
  setLanguage: (lang: string) => void;
  updateSafetyScore: (score: SafetyScore) => void;
  addFeedItem: (item: FeedItem) => void;
  toggleLiveTracking: () => void;
  updateDataSharing: (key: keyof AppContextType['dataSharing'], value: boolean) => void;
}

// Mock data
const mockUser: User = {
  id: '1',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@example.com',
  avatar: 'https://placehold.co/100x100/e2e8f0/333333?text=RS',
  digitalId: 'TouristSafe-Digital-ID-1234567890',
  idValidUntil: '25 Sep 2025',
};

const mockCompanions: Companion[] = [
  {
    id: '1',
    name: 'Anjali Verma',
    avatar: 'https://placehold.co/40x40/f6ad55/333333?text=AV',
    status: 'safe',
    safetyScore: 85,
  },
  {
    id: '2',
    name: 'Vikram Rathod',
    avatar: 'https://placehold.co/40x40/63b3ed/333333?text=VR',
    status: 'moderate',
    safetyScore: 65,
  },
];

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    relationship: 'Sister',
    phone: '+91 98765 43210',
  },
  {
    id: '2',
    name: 'Amit Singh',
    relationship: 'Friend',
    phone: '+91 98765 43211',
  },
];

const mockSafetyScore: SafetyScore = {
  score: 92,
  status: 'safe',
  factors: {
    areaRisk: 'low',
    anomaliesDetected: 'none',
    itineraryDeviation: 'on track',
  },
  suggestion: 'A safer walking route is available (+5 mins).',
};

const mockFeedItems: FeedItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'High Alert: Restricted Zone',
    message: 'You have entered a restricted area. Please leave immediately for your safety.',
    timestamp: '2 minutes ago',
    severity: 'high',
  },
  {
    id: '2',
    type: 'companion',
    title: 'Companion Update',
    message: 'Priya Singh has a low safety score (45/100). Check on them.',
    timestamp: '5 minutes ago',
    severity: 'medium',
  },
  {
    id: '3',
    type: 'system',
    title: 'System Recommendation',
    message: 'Heavy rainfall expected. Avoid trekking routes this afternoon.',
    timestamp: '10 minutes ago',
    severity: 'medium',
  },
  {
    id: '4',
    type: 'info',
    title: 'General Info',
    message: 'The local market is open until 9 PM today.',
    timestamp: '1 hour ago',
    severity: 'low',
  },
];

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<User>(mockUser);
  const [companions] = useState<Companion[]>(mockCompanions);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
  const [safetyScore, setSafetyScore] = useState<SafetyScore>(mockSafetyScore);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(mockFeedItems);
  const [liveTracking, setLiveTracking] = useState<boolean>(true);
  const [dataSharing, setDataSharing] = useState({
    anonymizedLocation: true,
    itineraryWithAuthorities: true,
    allowFamilyTracking: false,
  });
  const [language, setLanguage] = useState<string>('en');

  const updateSafetyScore = (score: SafetyScore) => {
    setSafetyScore(score);
  };

  const addFeedItem = (item: FeedItem) => {
    setFeedItems(prev => [item, ...prev]);
  };

  const toggleLiveTracking = () => {
    setLiveTracking(prev => !prev);
  };

  const updateDataSharing = (key: keyof AppContextType['dataSharing'], value: boolean) => {
    setDataSharing(prev => ({ ...prev, [key]: value }));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>): EmergencyContact => {
    const newContact: EmergencyContact = { id: String(Date.now()), ...contact };
    setEmergencyContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const value: AppContextType = {
    user: userState,
    setUser: setUserState,
    companions,
    emergencyContacts,
    addEmergencyContact,
    safetyScore,
    feedItems,
    liveTracking,
    dataSharing,
    language,
    setLanguage,
    updateSafetyScore,
    addFeedItem,
    toggleLiveTracking,
    updateDataSharing,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
