import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert, // Import Alert
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const doSignup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, username, password)
      .then(() => {
        console.log('Created new user successfully');
      
        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                
                navigation.navigate('Login');
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Welcome</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image source={require('./Logo.png')} style={styles.logo} />
        </View>
      </View>
      <Text style={[styles.subHeaderText, { marginBottom: 30, marginTop: 15 }]}>
        Please Sign-Up to create an account
      </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <View style={styles.inputColumn}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888888"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputColumn}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888888"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.centeredButtonContainer}>
        <TouchableOpacity
          style={[styles.signupButton, { padding: 20, height: 60, width: 150 }]}
          onPress={doSignup}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text
          style={[
            styles.footerText,
            { color: 'white', textAlign: 'center', marginBottom: 10 },
          ]}
        >
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text
            style={[
              styles.footerText,
              {
                color: 'white',
                textAlign: 'center',
                textDecorationLine: 'underline',
              },
            ]}
          >
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#293766',
    padding: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 10,
    borderBottomColor: '#48678b',
  },
  headerTextContainer: {
    marginStart: -20,
    top: 10,
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -10,
  },
  subHeaderText: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  logo: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  inputContainer: {
    flex: 0, 
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputColumn: {
    width: '48%',
  },
  label: {
    fontSize: 17,
    color: 'black',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#dee1ea',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    borderColor: '#bbb9ba',
    borderWidth: 1,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#f28159',
    borderRadius: 30,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredButtonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footer: {
    backgroundColor: '#293766',
    padding: 20,
    borderTopWidth: 10,
    borderTopColor: '#48678b', 
  },
  footerLine: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 16,
    color: 'white',
  },
});