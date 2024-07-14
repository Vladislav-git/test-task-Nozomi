import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Main from '../pages/Main';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import {RootStackParamList} from '../types/types';

export const AuthContext = React.createContext<AuthContextType | null>(null);

const Stack = createNativeStackNavigator<RootStackParamList>();

export type AuthContextType = {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
};

const AppNavigator = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  const validateToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const isAuthorized: boolean = await api.validateToken(token);
      setAuthToken(token);
      setAuthorized(isAuthorized);
    } else {
      setAuthorized(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, [authToken]);
  return (
    <AuthContext.Provider value={{authToken, setAuthToken}}>
      <Stack.Navigator initialRouteName="SignIn">
        {authorized ? (
          <Stack.Screen name="Main" component={Main} />
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default AppNavigator;
