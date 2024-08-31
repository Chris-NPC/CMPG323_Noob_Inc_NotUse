import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import Slider from '@react-native-community/slider';

const FeedbackScreen = ({ videoId }) => {
  const [feedback, setFeedback] = useState('');
  const [mark, setMark] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async () => {
    setIsSubmitting(true);
    try {
      // Simulating API call to submit feedback
      const response = await fetch('https://your-api.com/submissions/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          feedback,
          mark,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      console.log('Feedback submitted successfully');
      console.log(`Video ID: ${videoId}, Feedback: ${feedback}, Mark: ${mark}`);

      Alert.alert('Success', 'Feedback submitted successfully!');
      setFeedback('');
      setMark(50);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Video
        source={{ uri: `https://your-api.com/videos/${videoId}` }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        onChangeText={setFeedback}
        value={feedback}
        placeholder="Enter your feedback here"
      />

      <Text style={styles.markLabel}>Mark: {mark}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={mark}
        onValueChange={setMark}
      />

      <Button
        title="Submit Feedback"
        onPress={submitFeedback}
        disabled={isSubmitting}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  video: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
  },
  markLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    marginBottom: 20,
  },
});

export default FeedbackScreen;

// expo install expo-av
// npm install @react-native-community/slider

// expo install expo-av
// npm install @react-native-community/slider