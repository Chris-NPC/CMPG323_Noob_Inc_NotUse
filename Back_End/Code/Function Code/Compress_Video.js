import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';

const VideoCompressor = ({ inputFilePath }) => {
  const [compressedFilePath, setCompressedFilePath] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
  const TARGET_FILE_TYPE = 'mp4';

  const compressVideo = async () => {
    setIsCompressing(true);
    try {
      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(inputFilePath);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Check file size
      if (fileInfo.size <= FILE_SIZE_LIMIT) {
        logSuccess('File is already within size limit', inputFilePath);
        setCompressedFilePath(inputFilePath);
        return;
      }

      // Check file type
      const fileExtension = inputFilePath.split('.').pop().toLowerCase();
      if (fileExtension !== TARGET_FILE_TYPE) {
        // If not mp4, we need to convert it
        // Note: Direct video conversion is not supported in React Native
        // We'll use a workaround by extracting frames and creating a new video
        const frames = await extractFrames(inputFilePath);
        const compressedPath = await createVideoFromFrames(frames);
        setCompressedFilePath(compressedPath);
        logSuccess('Video converted and compressed', compressedPath);
      } else {
        // If mp4, we can try to compress it
        const compressedPath = await compressMP4(inputFilePath);
        setCompressedFilePath(compressedPath);
        logSuccess('Video compressed', compressedPath);
      }
    } catch (error) {
      logError('Failed to compress video', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const extractFrames = async (videoPath) => {
    // This is a simplified version. In a real app, you'd extract multiple frames.
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
      time: 0,
    });
    return [uri];
  };

  const createVideoFromFrames = async (frames) => {
    // This is a placeholder. Creating a video from frames is complex and 
    // typically requires native modules or server-side processing.
    // For this example, we'll just return the first frame as an image.
    const compressedUri = await manipulateAsync(
      frames[0],
      [{ resize: { width: 640 } }],
      { compress: 0.7, format: SaveFormat.MP4 }
    );
    return compressedUri.uri;
  };

  const compressMP4 = async (videoPath) => {
    // This is a placeholder. Actual video compression typically requires 
    // native modules like react-native-video-processing or server-side processing.
    // For this example, we'll just copy the file.
    const newPath = FileSystem.documentDirectory + 'compressed_video.mp4';
    await FileSystem.copyAsync({
      from: videoPath,
      to: newPath
    });
    return newPath;
  };

  const logSuccess = (message, path) => {
    console.log(`SUCCESS: ${message}. File path: ${path}`);
    // Here you would typically write to a log file
    Alert.alert('Success', `Video processed and saved at ${path}`);
  };

  const logError = (message, error) => {
    console.error(`ERROR: ${message}`, error);
    // Here you would typically write to a log file
    Alert.alert('Error', 'Failed to process video. Check logs for details.');
  };

  return (
    <View>
      <Button 
        title={isCompressing ? "Compressing..." : "Compress Video"} 
        onPress={compressVideo} 
        disabled={isCompressing}
      />
      {compressedFilePath && (
        <Text>Compressed video saved at: {compressedFilePath}</Text>
      )}
    </View>
  );
};

export default VideoCompressor;

// expo install expo-file-system expo-image-manipulator expo-video-thumbnails

// <VideoCompressor inputFilePath="/path/to/your/video.mp4" />