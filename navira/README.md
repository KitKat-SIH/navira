# TouristSafe - React Native App

A comprehensive tourist safety application built with React Native, Expo, and TypeScript.

## Features

### 🏠 Home Screen
- Live map view with user location
- Safety score widget overlay
- Live feed with alerts and updates
- Floating SOS button with long-press activation
- Fullscreen map toggle

### 📊 Safety Dashboard
- Real-time safety score display
- Contributing factors analysis
- Safety suggestions and recommendations
- Visual status indicators

### 🗺️ Route Planner
- Start and destination input
- Route options (Fastest, Shortest, Safest)
- Travel profiles (Night Travel, Solo Female, Family)
- Route finding functionality

### 📱 Digital ID (QR Code)
- Blockchain-based digital tourist ID
- QR code display for verification
- ID validity information
- Checkpoint verification support

### 👤 Profile & Settings
- User profile management
- Emergency contacts management
- Companion management
- Data sharing preferences
- Privacy controls

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **NativeWind** for styling (Tailwind CSS)
- **React Native Maps** for map functionality
- **React Native QR Code SVG** for QR generation
- **React Context** for state management

## Project Structure

```
├── App.tsx                 # Main app component with navigation
├── context/
│   └── AppContext.tsx     # Global state management
├── screens/
│   ├── HomeScreen.tsx     # Map view and live feed
│   ├── DashboardScreen.tsx # Safety dashboard
│   ├── PlannerScreen.tsx  # Route planning
│   ├── QRCodeScreen.tsx   # Digital ID display
│   ├── ProfileScreen.tsx  # Profile and settings
│   ├── EmergencyContactsScreen.tsx
│   ├── CompanionManagementScreen.tsx
│   └── DataSharingScreen.tsx
├── components/
│   ├── SafetyScoreWidget.tsx
│   ├── SOSButton.tsx
│   ├── FeedCard.tsx
│   └── AppHeader.tsx
└── assets/                # App icons and images
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## Key Features Implementation

### SOS Functionality
- Long-press activation (2 seconds)
- Emergency alert with confirmation
- Location and itinerary sharing with authorities

### Safety Scoring
- Real-time safety assessment
- Multiple contributing factors
- Visual status indicators
- Personalized suggestions

### Companion System
- Add companions via QR code or invite link
- Real-time safety status tracking
- Companion management interface

### Data Privacy
- Granular data sharing controls
- Anonymized location sharing
- Family tracking permissions
- Authority data sharing (SOS only)

## Future Enhancements

- [ ] Real-time map data integration
- [ ] Blockchain QR code generation
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Multi-language support
- [ ] Advanced route optimization
- [ ] Emergency service integration

## Development Notes

- Uses mock data for demonstration
- All API integrations are placeholder
- Responsive design for various screen sizes
- TypeScript for better development experience
- Component-based architecture for reusability
