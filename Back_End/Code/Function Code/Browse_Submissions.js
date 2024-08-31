import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OwnSubmissionsScreen = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOwnSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulating database retrieval with AsyncStorage
      // In a real app, you'd fetch from an API using the user's ID
      const userId = await AsyncStorage.getItem('userId');
      const allSubmissions = await AsyncStorage.getItem('submissions');
      
      if (allSubmissions) {
        const parsedSubmissions = JSON.parse(allSubmissions);
        const userSubmissions = parsedSubmissions.filter(sub => sub.userId === userId);
        setSubmissions(userSubmissions);
        console.log('User submissions retrieved successfully');
      } else {
        setSubmissions([]);
        console.log('No submissions found for the user');
      }
    } catch (err) {
      setError('Failed to fetch your submissions');
      console.error('Error fetching user submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSubmission = ({ item }) => (
    <View style={styles.submissionItem}>
      <Text style={styles.submissionTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.submissionDate}>Submitted: {new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="View My Submissions"
        onPress={fetchOwnSubmissions}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={submissions}
        renderItem={renderSubmission}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>You have no submissions</Text>}
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
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  submissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  submissionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default OwnSubmissionsScreen;

// npm install @react-native-async-storage/async-storage