import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const VideoUploader = ({ filePath }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_ENDPOINT = 'https://your-api-endpoint.com/upload'; // Replace with your actual API endpoint

  const uploadVideo = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Prepare the form data
      const formData = new FormData();
      formData.append('video', {
        uri: filePath,
        name: 'video.mp4',
        type: 'video/mp4'
      });

      // Open connection and upload file
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check if the upload was successful
      if (response.ok) {
        const result = await response.json();
        logSuccess('Video uploaded successfully', result);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      logError('Failed to upload video', error);
    } finally {
      setIsUploading(false);
    }
  };

  const logSuccess = (message, result) => {
    console.log(`SUCCESS: ${message}`, result);
    // Here you would typically write to a log file
    Alert.alert('Success', 'Video uploaded successfully');
  };

  const logError = (message, error) => {
    console.error(`ERROR: ${message}`, error);
    // Here you would typically write to a log file
    Alert.alert('Error', 'Failed to upload video. Check logs for details.');
  };

  // This function would be used with FileSystem.uploadAsync for progress tracking
  const uploadProgressCallback = (progress) => {
    const percentage = Math.round((progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100);
    setUploadProgress(percentage);
  };

  return (
    <View>
      <Button 
        title={isUploading ? "Uploading..." : "Upload Video"} 
        onPress={uploadVideo} 
        disabled={isUploading}
      />
      {isUploading && (
        <Text>Upload Progress: {uploadProgress}%</Text>
      )}
    </View>
  );
};

export default VideoUploader;

// expo install expo-file-system

// <VideoUploader filePath="/path/to/your/compressed/video.mp4" />