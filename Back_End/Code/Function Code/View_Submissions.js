import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubmissionsScreen = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulating database retrieval with AsyncStorage
      const storedSubmissions = await AsyncStorage.getItem('submissions');
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
        console.log('Submissions retrieved successfully');
      } else {
        setSubmissions([]);
        console.log('No submissions found');
      }
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSubmission = ({ item }) => (
    <View style={styles.submissionItem}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="View Submissions"
        onPress={fetchSubmissions}
        disabled={isLoading}
      />
      {isLoading && <Text>Loading submissions...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={submissions}
        renderItem={renderSubmission}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No submissions found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  submissionItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
});

export default SubmissionsScreen;

// npm install @react-native-async-storage/async-storage