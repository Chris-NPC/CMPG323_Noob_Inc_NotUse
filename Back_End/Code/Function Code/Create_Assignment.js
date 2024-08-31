import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AssignmentCreator = () => {
  const [subject, setSubject] = useState('');
  const [assignmentName, setAssignmentName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [assignmentInfo, setAssignmentInfo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateData = () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Subject is required');
      return false;
    }
    if (!assignmentName.trim()) {
      Alert.alert('Error', 'Assignment Name is required');
      return false;
    }
    if (!assignmentInfo.trim()) {
      Alert.alert('Error', 'Assignment Information is required');
      return false;
    }
    return true;
  };

  const createAssignment = () => {
    if (!validateData()) return;

    // Simulate database entry creation
    const assignmentData = {
      subject,
      assignmentName,
      dueDate: dueDate.toISOString(),
      assignmentInfo,
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would send this data to your backend API
    // For this example, we'll just simulate a successful creation
    setTimeout(() => {
      logSuccess('Assignment created successfully', assignmentData);
      resetForm();
    }, 1000);
  };

  const resetForm = () => {
    setSubject('');
    setAssignmentName('');
    setDueDate(new Date());
    setAssignmentInfo('');
  };

  const logSuccess = (message, data) => {
    console.log(`SUCCESS: ${message}`, data);
    // Here you would typically write to a log file
    Alert.alert('Success', 'Assignment created successfully');
  };

  const logError = (message, error) => {
    console.error(`ERROR: ${message}`, error);
    // Here you would typically write to a log file
    Alert.alert('Error', 'Failed to create assignment. Please try again.');
  };

  const onChangeDueDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Subject:</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Enter subject"
      />

      <Text style={styles.label}>Assignment Name:</Text>
      <TextInput
        style={styles.input}
        value={assignmentName}
        onChangeText={setAssignmentName}
        placeholder="Enter assignment name"
      />

      <Text style={styles.label}>Due Date:</Text>
      <Button onPress={() => setShowDatePicker(true)} title="Select Due Date" />
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDueDate}
        />
      )}
      <Text style={styles.dateDisplay}>{dueDate.toDateString()}</Text>

      <Text style={styles.label}>Assignment Information:</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={assignmentInfo}
        onChangeText={setAssignmentInfo}
        placeholder="Enter assignment details"
        multiline
        numberOfLines={4}
      />

      <Button title="Create Assignment" onPress={createAssignment} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateDisplay: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default AssignmentCreator;

//npm install @react-native-community/datetimepicker

//<AssignmentCreator />