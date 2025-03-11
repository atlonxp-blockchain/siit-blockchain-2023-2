import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, TouchableOpacity, Alert } from 'react-native';

import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import MenuPage from './Menu';
import Detail from './Detail';

const Stack = createStackNavigator();

export default function App() {
  const confirmLogout = (navigation) => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2d3a67',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Menu"
          component={MenuPage}
          options={({ navigation }) => ({
            title: '',
            headerRight: () => (
              <TouchableOpacity onPress={() => confirmLogout(navigation)}>
                <Image
                  source={require('./logout.png')}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
              </TouchableOpacity>
            ),
            headerLeft: null, 
          })}
        />
        <Stack.Screen
          name="Detail"
          component={Detail}
          options={({ route, navigation }) => ({
            title: '',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require('./back_arrow.png')}
                  style={{ width: 30, height: 30, marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
            headerBackTitle: 'Back', 
            headerRight: () => (
              <TouchableOpacity onPress={() => confirmLogout(navigation)}>
                <Image
                  source={require('./logout.png')}
                  style={{ width: 30, height: 30, marginRight: 10 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDrkQW30EdmoTzcvemd0sh3YbVYqjQDJQY",
  authDomain: "multi-7f1ef.firebaseapp.com",
  projectId: "multi-7f1ef",
  storageBucket: "multi-7f1ef.appspot.com",
  messagingSenderId: "297360211708",
  appId: "1:297360211708:web:26a16cb31ddbf7c321e179",
  measurementId: "G-Y5MLN588ND"
};

initializeApp(firebaseConfig);