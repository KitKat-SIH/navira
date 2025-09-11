import * as Location from 'expo-location';
import Constants from 'expo-constants';

let ws: WebSocket | null = null;
let watcher: Location.LocationSubscription | null = null;

const getEnv = (key: string): string | undefined => {
  // Access from Expo Constants extra config
  return Constants?.expoConfig?.extra?.[key];
};

export type StartOptions = {
  intervalMs?: number; // default 10s
};

export async function startLocationSocket(options: StartOptions = {}) {
  const url = getEnv('WS_URL');
  if (!url) {
    console.warn('WS_URL not configured. Skipping WebSocket tracking.');
    return;
  }

  const intervalMs = options.intervalMs ?? (Number(getEnv('LOCATION_INTERVAL_MS')) || 10000);

  // Request permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Location permission not granted. Skipping location tracking.');
    return;
  }

  // Open WebSocket
  try {
    ws = new WebSocket(url);
  } catch (e) {
    console.warn('Failed to open WebSocket:', e);
    ws = null;
  }

  // Start watching position
  watcher = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: intervalMs,
      distanceInterval: 0,
    },
    (loc) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const payload = {
        type: 'location',
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
        timestamp: new Date(loc.timestamp).toISOString(),
      };
      try {
        ws.send(JSON.stringify(payload));
      } catch (e) {
        console.warn('Failed to send WS payload:', e);
      }
    }
  );
}

export async function stopLocationSocket() {
  if (watcher) {
    try { await watcher.remove(); } catch {}
    watcher = null;
  }
  if (ws) {
    try { ws.close(); } catch {}
    ws = null;
  }
}


