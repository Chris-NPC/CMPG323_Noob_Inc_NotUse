import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VideoSelectionScreen = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const selectVideo = async () => {
    try {
      console.log('Opening file selection browser...');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: false,
      });

      if (result.type === 'success') {
        console.log('File selected:', result.uri);
        
        // Verify file type
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        const fileType = result.mimeType || fileInfo.mimeType;

        if (!fileType || !fileType.startsWith('video/')) {
          throw new Error('Selected file is not a video');
        }

        // Store file path
        await AsyncStorage.setItem('selectedVideoPath', result.uri);
        
        setSelectedVideo(result);
        console.log('File path stored successfully');
        
        Alert.alert('Success', 'Video selected successfully!');
      } else {
        console.log('File selection cancelled');
      }
    } catch (error) {
      console.error('Error selecting video:', error);
      Alert.alert('Error', 'Failed to select video. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Video" onPress={selectVideo} />
      {selectedVideo && (
        <Text style={styles.fileInfo}>
          Selected: {selectedVideo.name}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileInfo: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default VideoSelectionScreen;

// expo install expo-document-picker expo-file-system @react-native-async-storage/async-storage

//expo install expo-document-picker expo-file-system @react-native-async-storage/async-storage

// <VideoSelectionScreen />