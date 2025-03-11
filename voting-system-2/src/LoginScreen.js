import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // If the screen is focused and the route has a 'refresh' param,
    // refresh the screen (reset the state)
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        setUsername('');
        setPassword('');
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.refresh]);

  const doLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        console.log('Login successful');
        // Navigate to the Menu screen upon successful login
        navigation.navigate('Menu');
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alert('Authentication failed. Please check your username and password.');
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topContainer}>
        <Image source={require('./Logo.png')} style={styles.logo} />
      </View>
      <View style={styles.bottomContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#888888"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#888888"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { width: '48%' }]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.loginButton, { width: '48%' }]}
            onPress={doLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 2,
    backgroundColor: '#ec938b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    top: 20,
    borderRadius: 125,
  },
  bottomContainer: {
    flex: 1.5,
    backgroundColor: '#253360',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#fdfdfd',
    width: '80%',
    height: 50,
    borderRadius: 15,
    paddingLeft: 10,
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#f28159',
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
  },
  loginButton: {
    backgroundColor: '#ba454d',
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
  },
});
