import React, { useState, useContext } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../UserContext';
import styles from './styles/styles';
import { userIpAddress, serverPort } from '../globals';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const { setUser } = useContext(UserContext);

    const handleLoginIn = async () => {
        await fetch(`http://${userIpAddress}:${serverPort}/loginInUser`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.status === 200) {
                setUser(response.message);
                navigation.navigate("Home");
                setLoginError('');
            } else {
                setLoginError(response.message);
            }
        });
    }

    const handleSignUp = () => {
        navigation.navigate("SignUp");
    }

    return (
        <View>
            <Image
                source={require('./img/tribor_logo.png')}
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
            />
            <TouchableOpacity style={styles.btnLogin} onPress={handleLoginIn}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSignup} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text>{loginError}</Text>
        </View>
    );
}
export default LoginScreen;