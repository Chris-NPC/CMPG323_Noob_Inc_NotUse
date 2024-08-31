import React, { useState, useRef } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

const VideoRecorder = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const cameraRef = useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          const path = data.uri;
          setFilePath(path);
          logSuccess('Video recorded successfully', path);
        }
      } catch (error) {
        logError('Failed to record video', error);
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const logSuccess = (message, path) => {
    console.log(`SUCCESS: ${message}. File path: ${path}`);
    // Here you would typically write to a log file
    Alert.alert('Success', `Video recorded and saved at ${path}`);
  };

  const logError = (message, error) => {
    console.error(`ERROR: ${message}`, error);
    // Here you would typically write to a log file
    Alert.alert('Error', 'Failed to record video. Check logs for details.');
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <Button
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
            onPress={isRecording ? stopRecording : startRecording}
          />
        </View>
      </Camera>
      {filePath && <Text>Last recorded video: {filePath}</Text>}
    </View>
  );
};

export default VideoRecorder;

// npm install expo-camera expo-permissions expo-file-system

// expo install expo-camera expo-permissions expo-file-system