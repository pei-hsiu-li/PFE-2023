import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/styles';
import { userIpAddress, serverPort } from '../globals';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await fetch(`http://${userIpAddress}:${serverPort}/signInUser`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        phone: phone
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          navigation.navigate("Login");
          setLoginError('');
        } else {
          setLoginError(response.message);
        }
      });
  };

  return (
    <View >
      <Text style={styles.title}>Sign Up</Text>
      <ScrollView>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          placeholder="Phone"
          onChangeText={setPhone}
          value={phone}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          placeholder="Confirm Password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.buttonSignUp} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <Text>{loginError}</Text>
      </ScrollView>
    </View>
  );
};
export default SignUp;
