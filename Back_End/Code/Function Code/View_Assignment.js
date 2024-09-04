import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AssignmentViewer = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch assignments
      // In a real app, this would be an actual API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: '1', subject: 'Math', name: 'Algebra Homework', dueDate: '2023-09-01', info: 'Complete exercises 1-10' },
            { id: '2', subject: 'Science', name: 'Lab Report', dueDate: '2023-09-05', info: 'Write up results from photosynthesis experiment' },
            { id: '3', subject: 'History', name: 'Essay', dueDate: '2023-09-10', info: 'Write a 5-page essay on the Industrial Revolution' },
          ])
        }), 1000)
      );

      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
        logSuccess('Assignments fetched successfully');
      } else {
        throw new Error('Failed to fetch assignments');
      }
    } catch (error) {
      logError('Error fetching assignments', error);
    } finally {
      setLoading(false);
    }
  };

  const logSuccess = (message) => {
    console.log(`SUCCESS: ${message}`);
    // Here you would typically write to a log file
  };

  const logError = (message, error) => {
    console.error(`ERROR: ${message}`, error);
    // Here you would typically write to a log file
    Alert.alert('Error', 'Failed to fetch assignments. Please try again.');
  };

  const renderAssignment = ({ item }) => (
    <TouchableOpacity 
      style={styles.assignmentItem}
      onPress={() => viewAssignmentDetails(item)}
    >
      <Text style={styles.assignmentName}>{item.name}</Text>
      <Text>Subject: {item.subject}</Text>
      <Text>Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  const viewAssignmentDetails = (assignment) => {
    Alert.alert(
      assignment.name,
      `Subject: ${assignment.subject}\nDue Date: ${new Date(assignment.dueDate).toLocaleDateString()}\n\nDetails: ${assignment.info}`
    );
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading assignments...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Assignments</Text>
      <FlatList
        data={assignments}
        renderItem={renderAssignment}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No assignments found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  assignmentItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  assignmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AssignmentViewer;

// <AssignmentViewer />