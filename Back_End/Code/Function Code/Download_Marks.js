import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const MarksDownloadScreen = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadMarks = async () => {
    setIsDownloading(true);

    try {
      // Simulating server connection and marks data retrieval
      console.log('Opening server connection...');
      console.log('Reading marks data from the database...');

      // Simulating API call to get marks data
      const response = await fetch('https://your-api.com/marks/download');
      if (!response.ok) {
        throw new Error('Failed to retrieve marks data');
      }

      const marksData = await response.json();

      // Prepare marks data into a CSV file
      const csvContent = prepareCSV(marksData);

      // Save CSV content to a file
      const fileName = 'marks_data.csv';
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      console.log('Marks file prepared successfully');
      console.log('Server connection closed');

      // Share the downloaded file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        Alert.alert('Success', 'Marks file downloaded successfully!');
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }

      console.log('Marks file download process completed');
    } catch (error) {
      console.error('Error downloading marks:', error);
      Alert.alert('Error', 'Failed to download marks. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to prepare CSV content
  const prepareCSV = (data) => {
    const header = 'Student ID,Name,Mark\n';
    const rows = data.map(item => `${item.studentId},${item.name},${item.mark}`).join('\n');
    return header + rows;
  };

  return (
    <View style={styles.container}>
      <Button
        title="Download Marks"
        onPress={downloadMarks}
        disabled={isDownloading}
      />
      {isDownloading && <Text style={styles.loadingText}>Preparing marks file...</Text>}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default MarksDownloadScreen;

// expo install expo-file-system expo-sharing

// expo install expo-file-system expo-sharing