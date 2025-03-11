import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function LoadingScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./Logo.png')} style={styles.logo} />
      </View>   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3a67',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  loadtext: {
    width: '75%', 
    height: 75, 
    position: 'absolute',
    bottom: 110, 
  },
  claw: {
    position: 'absolute',
    width: 120,
    height: 120,
    top: 10,
    right: 10,
  },
});
