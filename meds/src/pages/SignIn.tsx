import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/types';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../context/context';
import Icon from 'react-native-vector-icons/Ionicons';

type SignInNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface Props {
  navigation: SignInNavigationProp;
}

const SignIn: React.FC<Props> = ({navigation}) => {
  const {setAuthToken} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const token = await api.signIn(email, password);
      await AsyncStorage.setItem('token', token);
      setAuthToken(token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.logoContainer}>
          <Icon name="medical" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputContainer}>
          <Icon
            name="mail-outline"
            size={24}
            color="#999"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon
            name="lock-closed-outline"
            size={24}
            color="#999"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpButtonText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  signInButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  signUpButton: {
    paddingVertical: 14,
  },
  signUpButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SignIn;
