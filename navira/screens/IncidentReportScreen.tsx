import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useApp } from '../context/AppContext';
import Constants from 'expo-constants';

interface IncidentReportScreenProps {
  navigation: any;
}

export const IncidentReportScreen: React.FC<IncidentReportScreenProps> = ({ navigation }) => {
  const { user } = useApp();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getEnv = (key: string): string | undefined => {
    return Constants?.expoConfig?.extra?.[key];
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions to add images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permissions to record audio.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const convertImageToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const convertAudioToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const submitReport = async () => {
    if (!description.trim()) {
      Alert.alert('Description required', 'Please provide a description of the incident.');
      return;
    }

    setIsSubmitting(true);

    try {
      const wsUrl = getEnv('WS_URL');
      if (!wsUrl) {
        throw new Error('WebSocket URL not configured');
      }

      // Convert images to base64
      const imageBase64s = await Promise.all(images.map(convertImageToBase64));

      // Convert audio to base64 if exists
      let voiceBase64 = '';
      if (recording) {
        const uri = recording.getURI();
        if (uri) {
          voiceBase64 = await convertAudioToBase64(uri);
        }
      }

      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      
      await new Promise((resolve, reject) => {
        ws.onopen = () => {
          const payload = {
            type: 'incident',
            description: description.trim(),
            timestamp: new Date().toISOString(),
            encrypted_id: user.digitalId,
            images: imageBase64s,
            voice: voiceBase64 || undefined,
          };

          ws.send(JSON.stringify(payload));
          ws.close();
          resolve(true);
        };

        ws.onerror = (error) => {
          reject(error);
        };
      });

      Alert.alert('Success', 'Incident report submitted successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Failed to submit incident report:', error);
      Alert.alert('Error', 'Failed to submit incident report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Incident</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={styles.textArea}
          placeholder="Describe the incident in detail..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Images */}
      <View style={styles.section}>
        <Text style={styles.label}>Photos</Text>
        <View style={styles.imageActions}>
          <TouchableOpacity onPress={takePhoto} style={styles.imageBtn}>
            <Ionicons name="camera" size={20} color="#2563eb" />
            <Text style={styles.imageBtnText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
            <Ionicons name="images" size={20} color="#2563eb" />
            <Text style={styles.imageBtnText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
        
        {images.length > 0 && (
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageItem}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={styles.removeImageBtn}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Voice Recording */}
      <View style={styles.section}>
        <Text style={styles.label}>Voice Recording (Optional)</Text>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
        >
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={24}
            color={isRecording ? "#ef4444" : "#2563eb"}
          />
          <Text style={[styles.recordBtnText, isRecording && styles.recordBtnTextActive]}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
        {recording && !isRecording && (
          <Text style={styles.recordingStatus}>Voice recording ready</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={submitReport}
        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
        disabled={isSubmitting}
      >
        <Text style={styles.submitBtnText}>
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 16,
    paddingTop: 8,
  },
  backBtn: { padding: 10, marginLeft: -10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937', textAlign: 'center', flex: 1 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 8 },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
  },
  imageActions: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  imageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  imageBtnText: { marginLeft: 8, color: '#2563eb', fontWeight: '600' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  imageItem: { position: 'relative' },
  image: { width: 80, height: 80, borderRadius: 8 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8 },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  recordBtnActive: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
  recordBtnText: { marginLeft: 8, color: '#2563eb', fontWeight: '600' },
  recordBtnTextActive: { color: '#ef4444' },
  recordingStatus: { marginTop: 8, color: '#6b7280', fontSize: 12, textAlign: 'center' },
  submitBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  submitBtnDisabled: { backgroundColor: '#9ca3af' },
  submitBtnText: { color: 'white', fontWeight: '700', textAlign: 'center' },
});
