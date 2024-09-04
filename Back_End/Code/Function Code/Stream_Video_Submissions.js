import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Video } from 'expo-av';

const VideoStreamingScreen = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const streamVideo = async (videoId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulating server connection and video stream initialization
      const response = await fetch(`https://your-api.com/videos/${videoId}/stream`);
      if (!response.ok) {
        throw new Error('Failed to initialize video stream');
      }

      const streamData = await response.json();
      setVideoUrl(streamData.streamUrl);

      console.log(`Video stream initialized for video ID: ${videoId}`);

    } catch (err) {
      setError('Failed to stream video');
      console.error('Error streaming video:', err);
      Alert.alert('Error', 'Failed to stream video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoEnd = () => {
    console.log('Video playback ended');
    // Here you could implement logic to close the server connection if needed
  };

  const handleVideoError = (error) => {
    console.error('Video playback error:', error);
    setError('Error playing video');
    Alert.alert('Playback Error', 'There was an error playing the video. Please try again.');
  };

  return (
    <View style={styles.container}>
      <Button
        title="Stream Video"
        onPress={() => streamVideo('example-video-id')}
        disabled={isLoading}
      />

      {isLoading && <Text>Initializing video stream...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {videoUrl && (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              handleVideoEnd();
            }
          }}
          onError={handleVideoError}
        />
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
  video: {
    width: 300,
    height: 200,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default VideoStreamingScreen;

// expo install expo-av

// expo install expo-av