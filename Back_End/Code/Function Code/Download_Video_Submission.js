import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const VideoDownloadScreen = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadVideo = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Simulating server connection and video file preparation
      const videoUrl = 'https://your-api.com/videos/example-video-id/download';
      const fileName = 'downloaded_video.mp4';
      const fileUri = FileSystem.documentDirectory + fileName;

      console.log('Server connection opened, preparing video file...');

      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      console.log('Video file downloaded successfully');

      // Simulating server connection closure
      console.log('Server connection closed');

      Alert.alert('Success', 'Video downloaded successfully!');

      // Share the downloaded file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }

    } catch (error) {
      console.error('Error downloading video:', error);
      Alert.alert('Error', 'Failed to download video. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Download Video"
        onPress={downloadVideo}
        disabled={isDownloading}
      />
      {isDownloading && (
        <View style={styles.progressContainer}>
          <Text>Downloading: {Math.round(downloadProgress * 100)}%</Text>
        </View>
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
  progressContainer: {
    marginTop: 20,
  },
});

export default VideoDownloadScreen;

// expo install expo-file-system expo-sharing

// expo install expo-file-system expo-sharing