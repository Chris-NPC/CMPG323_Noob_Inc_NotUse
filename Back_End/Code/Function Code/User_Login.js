import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { SHA256 } from 'crypto-js';

const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const hashPassword = (password) => {
    return SHA256(password).toString();
  };

  const login = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoggingIn(true);

    try {
      const hashedPassword = hashPassword(password);

      console.log('Verifying username and hashed password...');

      // Simulating API call for authentication
      const response = await fetch('https://your-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password: hashedPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      if (data.token) {
        console.log('Authentication successful, token generated');
        
        // Store the token securely
        await SecureStore.setItemAsync('userToken', data.token);

        console.log('Token stored securely');
        Alert.alert('Success', 'Login successful!');
        
        // Call the onLoginSuccess callback with the token
        onLoginSuccess(data.token);
      } else {
        throw new Error('No token received');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isLoggingIn ? "Logging in..." : "Login"}
        onPress={login}
        disabled={isLoggingIn}
      />
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;

// expo install expo-secure-store
// npm install crypto-js

//use this component in app, passing an onLoginSucess callback
//<LoginScreen onLoginSuccess={(token) => {
//  // Handle successful login, e.g., navigate to main app screen
//  console.log('Logged in with token:', token);
//}} />