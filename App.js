import React, { useState } from 'react';
import { StyleSheet, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './IoTApp/HomeScreen';
import LoginScreen from './IoTApp/LoginScreen';
import SignUpScreen from './IoTApp/SignUpScreen';
import ControlScreen from './IoTApp/ControlScreen';
import ProfileScreen from './IoTApp/ProfileScreen';
import ScanBleModal from './IoTApp/ScanBleModal';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserContext from './UserContext';

if (__DEV__) {
  const ignoreWarns = [
    "Got a component with the name 'profile' for the screen 'Profile'. React Components must start with an uppercase letter. If you're passing a regular function and not a component, pass it as children to 'Screen' instead. Otherwise capitalize your component's name.",
    "`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.",
    "`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method."
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}

const Stack = createNativeStackNavigator();

const App = () => {

  const [user, setUser] = useState(null);

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />

          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
          />

          <Stack.Screen
            name="ControlDetail"
            component={ControlScreen}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
          />
          
          <Stack.Screen
            name="ScanBle"
            component={ScanBleModal}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  touchableProfileStyle: {

    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    top: 10,
    left: 10,
  },
})

export default App