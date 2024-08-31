import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewSubmissionsWithFeedback = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissionsWithFeedback = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulating database retrieval with AsyncStorage
      const storedSubmissions = await AsyncStorage.getItem('submissionsWithFeedback');
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
        console.log('Submissions with feedback retrieved successfully');
      } else {
        setSubmissions([]);
        console.log('No submissions with feedback found');
      }
    } catch (err) {
      setError('Failed to fetch submissions with feedback');
      console.error('Error fetching submissions with feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSubmission = ({ item }) => (
    <View style={styles.submissionItem}>
      <Text style={styles.submissionTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.feedbackTitle}>Feedback:</Text>
      <Text>{item.feedback || 'No feedback provided yet'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="View Submissions with Feedback"
        onPress={fetchSubmissionsWithFeedback}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={submissions}
        renderItem={renderSubmission}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No submissions with feedback found</Text>}
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
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
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

export default ViewSubmissionsWithFeedback;

// npm install @react-native-async-storage/async-storage